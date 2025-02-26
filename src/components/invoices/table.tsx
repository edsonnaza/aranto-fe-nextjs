import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/components/invoices/buttons';
import InvoiceStatus from '@/components/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/lib/utils';
import { fetchFilteredInvoices } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
 

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);

  return (
    // <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
    //   <div className="max-w-full overflow-x-auto">
    //     <div className="min-w-[1102px]">
    //       <div className="md:hidden">
    //         {invoices?.map((invoice) => (
    //           <div
    //             key={invoice.id}
    //             className="mb-2 w-full rounded-md bg-white p-4"
    //           >
    //             <div className="flex items-center justify-between border-b pb-4">
    //               <div>
    //                 <div className="mb-2 flex items-center">
    //                   <Image
    //                     src={invoice.image_url}
    //                     className="mr-2 rounded-full"
    //                     width={28}
    //                     height={28}
    //                     alt={`${invoice.name}'s profile picture`}
    //                   />
    //                   <p>{invoice.name}</p>
    //                 </div>
    //                 <p className="text-sm text-gray-500">{invoice.email}</p>
    //               </div>
    //               <InvoiceStatus status={invoice.status} />
    //             </div>
    //             <div className="flex w-full items-center justify-between pt-4">
    //               <div>
    //                 <p className="text-xl font-medium">
    //                   {formatCurrency(invoice.amount)}
    //                 </p>
    //                 <p>{formatDateToLocal(invoice.date)}</p>
    //               </div>
    //               <div className="flex justify-end gap-2">
    //                 <UpdateInvoice id={invoice.id} />
    //                 <DeleteInvoice id={invoice.id} />
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //       <table className="hidden min-w-full text-gray-900 md:table">
    //         <thead className="rounded-lg text-left text-sm font-normal">
    //           <tr>
    //             <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
    //               Customer
    //             </th>
    //             <th scope="col" className="px-3 py-5 font-medium">
    //               Email
    //             </th>
    //             <th scope="col" className="px-3 py-5 font-medium">
    //               Amount
    //             </th>
    //             <th scope="col" className="px-3 py-5 font-medium">
    //               Date
    //             </th>
    //             <th scope="col" className="px-3 py-5 font-medium">
    //               Status
    //             </th>
    //             <th scope="col" className="relative py-3 pl-6 pr-3">
    //               <span className="sr-only">Edit</span>
    //             </th>
    //           </tr>
    //         </thead>
    //         <tbody className="bg-white">
    //           {invoices?.map((invoice) => (
    //             <tr
    //               key={invoice.id}
    //               className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
    //             >
    //               <td className="whitespace-nowrap py-3 pl-6 pr-3">
    //                 <div className="flex items-center gap-3">
    //                   <Image
    //                     src={invoice.image_url}
    //                     className="rounded-full"
    //                     width={28}
    //                     height={28}
    //                     alt={`${invoice.name}'s profile picture`}
    //                   />
    //                   <p>{invoice.name}</p>
    //                 </div>
    //               </td>
    //               <td className="whitespace-nowrap px-3 py-3">
    //                 {invoice.email}
    //               </td>
    //               <td className="whitespace-nowrap px-3 py-3">
    //                 {formatCurrency(invoice.amount)}
    //               </td>
    //               <td className="whitespace-nowrap px-3 py-3">
    //                 {formatDateToLocal(invoice.date)}
    //               </td>
    //               <td className="whitespace-nowrap px-3 py-3">
    //                 <InvoiceStatus status={invoice.status} />
    //               </td>
    //               <td className="whitespace-nowrap py-3 pl-6 pr-3">
    //                 <div className="flex justify-end gap-3">
    //                   <UpdateInvoice id={invoice.id} />
    //                   <DeleteInvoice id={invoice.id} />
    //                 </div>
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    // </div>
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Project Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Team
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Budget
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {invoices?.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={invoice.image_url}
                          alt={invoice.image_url}
                        />
                      </div>
                   
                    </div>
                  </TableCell>
                  
                   
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        invoice.status === "Active"
                          ? "success"
                          : invoice.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {invoice.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>

  );
}
