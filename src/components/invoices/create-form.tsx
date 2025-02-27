// "use client";

// import { CustomerField } from "@/lib/definitions";
// import { createInvoice } from "@/lib/actions";
// import {  useState } from "react";
// import { toast } from 'react-toastify';
// import { useRouter, } from 'next/navigation';
// import Link from "next/link";

// import {
//   CheckIcon,
//   ClockIcon,
//   CurrencyDollarIcon,
//   UserCircleIcon,
// } from "@heroicons/react/24/outline";
// import { Button } from "@/components/ui/button";

// // interface inputError {
// //   customerId:string;
// //   amount:string;
// //   status: string;
// //   [key: string]: string;

// // }

// export default function Form({ customers }: { customers: CustomerField[] }) {
//   const initialState: State = { message: null, errors: {} };
//   const router = useRouter();
   

//   // const initInputError:inputError = {
//   //   customerId: "Por favor, seleccionar un cliente.",
//   //   amount: "El importe debe ser mayor a cero (0).",
//   //   status: "Debe ser pagado o pendiente (enum: Paid o Pending)."
//   // };

//   // const [state, formAction] = useActionState(createInvoice, initialState);
//    const [inputEntry, setInputEntry] = useState({
//       customerId: null, // Inicialmente null
//       amount: null,
//       status: null,
//   });
//   const [inputError, setInputError] = useState<{ [key: string]: string }>({});
//   const [formIsValid, setFormIsValid] = useState(false);
 

//   const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     console.log({ Saving: "Validating form...", inputEntry });

//     const newErrors: { [key: string]: string } = {};

//     // Validar todos los campos de inputEntry
//     Object.entries(inputEntry).forEach(([name, value]) => {
//         const error = checkInputEntry(name, value);
//         if (error) {
//             newErrors[name] = error; // Guardamos el error si existe
//         }
//     });

//     // Actualizar estado de errores
//     setInputError(newErrors);

//     // Si hay errores, detener el envío del formulario
//     if (Object.keys(newErrors).length > 0) {
//         setFormIsValid(false);
//         console.log({ inputError: newErrors, Error: "There is empty data" });
//         return;
//     }

//     setFormIsValid(true);
//   // Si tu función crea una factura con el objeto inputEntry
//   //const inputEntry = { customerId, amount, status };

// // Validación previa de los datos (puedes usar alguna librería de validación aquí si lo necesitas)
// if (!inputEntry.customerId || !inputEntry.amount || !inputEntry.status) {
//   setInputError({'message':'Todos los campos son requeridos'});
//   return;
// }

// // Llamar la función de servidor para crear la factura
// const formData = new FormData();
// formData.append('customerId', inputEntry.customerId);
// formData.append('amount', inputEntry.amount);
// formData.append('status', inputEntry.status);

// try {
//   const result = await createInvoice(formData); // Esto llama la función server action

//   if (result.success) {
 
    
//    await toast.success('Factura creada correctamente');
//     // toast({
//     //   title: 'Factura creada',
//     //   description: 'La factura se ha creado exitosamente.',
//     //   status: 'success',
//     //   duration: 5000,
//     //   isClosable: true,
//     // });

//     router.push('/dashboard/invoices'); 

//   } else {
//     console.log(result.message || 'Hubo un error');
//   }
// } catch (err) {
//   console.log('Hubo un error al procesar la solicitud'+err);
// }
 
// };

// // Manejador de entrada que también elimina errores si el valor es válido
// const handlerInput = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//   const { name, value } = event.target;
//   const sanitizedValue = value.trim() === "" ? null : value; // Si el usuario borra el input, lo deja como null

//   setInputEntry((prev) => ({
//       ...prev,
//       [name]: sanitizedValue,
//   }));

//   // Validar la entrada y eliminar el error si es válida
//   const error = checkInputEntry(name, sanitizedValue);
//   setInputError((prevErrors) => {
//       const updatedErrors = { ...prevErrors };
//       if (!error) {
//           delete updatedErrors[name]; // Eliminar el error si ya no es necesario
//       } else {
//           updatedErrors[name] = error; // Mantener el error si aún es inválido
//       }
//       return updatedErrors;
//   });
// };

// // Función de validación individual para cada input
// const checkInputEntry = (name: string, value: any): string | null => {
   
//   if (name === "customerId" && (!value || value === null)) {
//         return "Por favor, seleccionar un cliente.";
//     }

//     if (name === "amount" && (value === null || isNaN(Number(value)) || Number(value) <= 0)) {
//         return "El importe debe ser mayor a cero (0).";
//     }

//     if (name === "status") {
//       const validStatuses = ["paid", "pending"]; // Ahora en minúsculas
//       if (!value || !validStatuses.includes(value.toLowerCase())) {
//           return "Debe ser 'Pagado' o 'Pendiente'.";
//       }
//   }

//     return null; // Si no hay error, retorna null
// };
  
//   return (
//     <form onSubmit={onSubmitForm}>
//       <div className="rounded-md bg-gray-50 p-4 md:p-6">
//         {/* Customer Name */}
//         <div className="mb-4">
//           <label htmlFor="customer" className="mb-2 block text-sm font-medium">
//             Seleccione Cliente
//           </label>
//           <div className="relative">
//             <select
//               id="customer"
//               name="customerId"
//               className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               defaultValue=""
//               aria-describedby="customer-error"
//               onChange={handlerInput}
//             >
//               <option value="" disabled>
//                 Seleccionar un Cliente
//               </option>
//               {customers.map((customer) => (
//                 <option key={customer.id} value={customer.id}>
//                   {customer.name}
//                 </option>
//               ))}
//             </select>
//             <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
//           </div>
//           <div id="customer-error" aria-live="polite" aria-atomic="true">
//             {state?.errors?.customerId &&
//               state?.errors.customerId.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))}
//           </div>

//           {inputError.customerId && <p className='font-normal text-red-500'>{inputError.customerId}</p>}
//         </div>

//         {/* Invoice Amount */}
//         <div className="mb-4">
//           <label htmlFor="amount" className="mb-2 block text-sm font-medium">
//             Elija un importe
//           </label>
//           <div className="relative mt-2 rounded-md">
//             <div className="relative">
//               <input
//                 id="amount"
//                 name="amount"
//                 type="number"
//                 step="0.01"
//                 placeholder="Enter USD amount"
//                 aria-describedby="amount-error"
//                 className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//                 onChange={handlerInput}
//               />
//               <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
//             </div>
//           </div>
//           <div id="amount-error" aria-live="polite" aria-atomic="true">
//             {state?.errors?.amount &&
//               state?.errors.amount.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))}
//                {inputError.amount && <p className='font-normal text-red-500'>{inputError.amount}</p>}
//           </div>
//         </div>

//         {/* Invoice Status */}
//         <fieldset>
//           <legend className="mb-2 block text-sm font-medium">
//             Estatus de la Factura
//           </legend>
//           <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
//             <div className="flex gap-4">
//               <div className="flex items-center">
//                 <input
//                   id="pending"
//                   name="status"
//                   type="radio"
//                   value="pending"
//                   aria-describedby="status-error"
//                   className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
//                   onChange={handlerInput}
//                 />
//                 <label
//                   htmlFor="pending"
//                   className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
//                 >
//                   Pendiente <ClockIcon className="h-4 w-4" />
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="paid"
//                   name="status"
//                   type="radio"
//                   value="paid"
//                   onChange={handlerInput}
//                   aria-describedby="paid-error"
//                   className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
//                 />
//                 <label
//                   htmlFor="paid"
//                   className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
//                 >
//                   Pagado <CheckIcon className="h-4 w-4" />
//                 </label>
//               </div>
//             </div>
//           </div>
//           <div id="status-error" aria-live="polite" aria-atomic="true">
//             {state?.errors?.status &&
//               state?.errors.status.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))}

//             {inputError.status && <p className='font-normal text-red-500'>{inputError.status}</p>}
//           </div>

//           {state?.message && (
//             <p className="mt-2 text-sm text-red-500">{state.message && inputError.message}</p>
//           )}
//         </fieldset>
//       </div>
//       <div className="mt-6 flex justify-end gap-4">
//         <Link
//           href="/dashboard/invoices"
//           className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
//         >
//           Cancel
//         </Link>
//         <Button  type="submit">Guardar Factura</Button>
         
//       </div>
//     </form>
//   );
// }
