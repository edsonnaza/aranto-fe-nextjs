'use server';

import { z } from 'zod';
import {prisma} from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
//import { signIn } from '@/auth';
import { signIn } from "next-auth/react";
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export type State ={
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
}

const FormSchema = z.object({
  customerId: z.string({
    invalid_type_error: 'Por favor, seleccionar un cliente.'
  }),
  amount: z.coerce.number().gt(0,{message: 'Por favor ingresar un monto mayor a cero (0)'}),
  status: z.enum(['pending', 'paid'],{ invalid_type_error:'Por favor, seleccionar un estatus válido.'}),
});
console.log({FormSchema})
export async function createInvoice(formData: FormData) {
    var success = false;
    //Validate form fields using Zod.
    const validatedFields = FormSchema.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    if(!validatedFields.success){
      return {
        errors: validatedFields.error?.flatten().fieldErrors,
        message: 'Campos obligatorios aun deben ser rellenados.',
        values: { // Aquí guardamos los valores correctos
          customerId: formData.get('customerId') || '',
          amount: formData.get('amount') || '',
          status: formData.get('status') || '',
        },


      }
    }

    const { customerId, amount, status } = validatedFields?.data;
    const amountInCents = amount * 100;
    const date = new Date(); // Guardar fecha completa como DateTime en Prisma
  
    try {

      await prisma.invoices.create({
        data: {
          customer_id: customerId,
          amount: amountInCents,
          status,
          date, // Prisma espera un tipo `Date`, no `string`
        },
      });

    return { success: true, message: 'Invoice created successfully' };
    revalidatePath('/dashboard/invoices');
   //return redirect('/dashboard/invoices');
   success = true;
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, message: 'Failed to create invoice' };
  }

  if(success) {
      redirect('/dashboard/invoices')
  }
}

// Función para actualizar la factura


export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
 

   //Validate form fields using Zod.
   const validatedFields = FormSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
   

  if(!validatedFields.success){
    return {
      errors: validatedFields.error?.flatten().fieldErrors,
      message: 'Campos obligatorios aun deben ser rellenados.',
      values: { // Aquí guardamos los valores correctos
        customerId: formData.get('customerId') || '',
        amount: formData.get('amount') || '',
        status: formData.get('status') || '',
      },
    }
  }

  try {
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
  
    console.log({id,customerId,amount,status})
    
    // Actualizar la factura en la base de datos
    const updatedInvoice = await prisma.invoices.update({
      where: { id },
      data: {
        customer_id: customerId,
        amount: amountInCents,
        status,
      },
    });

    if (!updatedInvoice) {
      throw new Error(`Factura con id ${id} no encontrada.`);
    }

    // Revalidar la caché de Next.js para la página de facturas
    //revalidatePath("/dashboard/invoices");

    return { success: true, message: "Factura actualizada correctamente", prevState };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Error al actualizar la factura" };
  }
}
    

export async function deleteInvoice(id: string) {
    try {
      // Elimina la factura con el ID especificado usando Prisma
      const deletedInvoice = await prisma.invoices.delete({
        where: { id },  // Busca la factura por su ID
      });
  
      // Verifica si se ha eliminado la factura
      if (!deletedInvoice) {
        throw new Error(`Invoice with id ${id} not found.`);
      }
  
      // Revalida la ruta para actualizar el dashboard
      revalidatePath('/dashboard/invoices');
  
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to delete invoice');
    }
  }