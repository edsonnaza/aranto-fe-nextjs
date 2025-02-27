import { prisma } from '../../prisma/prisma';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
 
  LatestInvoiceRaw,
  Revenue
} from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
  try {
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await prisma.$queryRaw<Revenue[]>`SELECT * FROM revenue`;
    console.log('Data fetch completed after 3 seconds.');
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await prisma.$queryRaw<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    return data.map(invoice => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*) AS count FROM invoices`,
      prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*) AS count FROM customers`,
      prisma.$queryRaw<{ paid: number; pending: number }[]>`
        SELECT 
          COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS paid,
          COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) AS pending
        FROM invoices`
    ]);

    return {
      numberOfInvoices: Number(invoiceCount[0]?.count ?? 0),
      numberOfCustomers: Number(customerCount[0]?.count ?? 0),
      totalPaidInvoices: formatCurrency(invoiceStatus[0]?.paid ?? 0),
      totalPendingInvoices: formatCurrency(invoiceStatus[0]?.pending ?? 0),
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await prisma.$queryRawUnsafe(`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE $1 OR
        customers.email ILIKE $2 OR
        invoices.amount::TEXT ILIKE $3 OR
        invoices.date::TEXT ILIKE $4 OR
        invoices.status ILIKE $5
      ORDER BY invoices.date DESC
      LIMIT $6 OFFSET $7`,
      `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`,
      ITEMS_PER_PAGE, offset
    );

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await prisma.$queryRawUnsafe<{ count: bigint }[]>(`
      SELECT COUNT(*) AS count
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE $1 OR
        customers.email ILIKE $2 OR
        invoices.amount::TEXT ILIKE $3 OR
        invoices.date::TEXT ILIKE $4 OR
        invoices.status ILIKE $5`,
      `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`
    );

    return Math.ceil(Number((data[0] as { count: bigint })?.count || 0) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await prisma.$queryRaw<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id}`;

    return data.map(invoice => ({
      ...invoice,
      amount: invoice.amount / 100,
    }))[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    return await prisma.$queryRaw<CustomerField[]>`
      SELECT id, name FROM customers ORDER BY name ASC`;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}



export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await prisma.$queryRaw<CustomersTableType[]>`
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url,
        COUNT(invoices.id) AS total_invoices,
        COALESCE(SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END), 0) AS total_pending,
        COALESCE(SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END), 0) AS total_paid
      FROM customers
      LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
      ORDER BY customers.name ASC`;

    return data.map(customer => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
