// import Form from '@/components/invoices/create-form';
// import Breadcrumbs from '@/components/invoices/breadcrumbs';
// import { fetchCustomers } from '@/lib/data';
 
// export default async function Page() {
//   const customers = await fetchCustomers();
 
//   return (
//     <main>
//       <Breadcrumbs
//         breadcrumbs={[
//           { label: 'Invoices', href: '/dashboard/invoices' },
//           {
//             label: 'Crear Facturas',
//             href: '/dashboard/invoices/create',
//             active: true,
//           },
//         ]}
//       />
//       <Form customers={customers} />
//     </main>
//   );
// }

const CreateInvoice = ()=>{
  return (<h1>Create Invoice </h1>)
}

export default CreateInvoice;