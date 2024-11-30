'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { LoginSchema, typeLoginSchema, typeRegisterSchema } from '@/schemas'
import { authErrors } from '@/errors'

export async function login(data: typeLoginSchema) {
  const supabase = await createClient()
  const validatedData = LoginSchema.safeParse(data)

  if (!validatedData.success) {
    return authErrors['INVALID_CREDENTIALS']
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  
  if (error) {
    const code = error.code ? error.code.toUpperCase() as keyof typeof authErrors : 'UNKNOWN_ERROR';
    return authErrors[code];
  }

  revalidatePath('/', 'layout')
  return redirect("/");
}

export async function register(data: typeRegisterSchema) {
  const supabase = await createClient()
  const validatedData = LoginSchema.safeParse(data)

  if (!validatedData.success) {
    return authErrors['INVALID_CREDENTIALS']
  }


  const { error } = await supabase.auth.signUp({
    ...data,
    options: {
      data: {
        first_name: data.name,
      }
    }
  })

  if (error) {
    const code = error.code ? error.code.toUpperCase() as keyof typeof authErrors : 'UNKNOWN_ERROR';
    return authErrors[code];
  }

  return {success: 'Por favor, verifique seu e-mail.'}
}

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/auth/login");
};

export const loginWithGithub = async () => {
  const supabase = await createClient();
  const {data} = await supabase.auth.signInWithOAuth({ provider: 'github', options: {redirectTo: 'http://localhost:3000/auth/confirm'} });
  if (data.url) {
    redirect(data.url)
  }
};

export const loginWithGoogle= async () => {
  const supabase = await createClient();
  const {data} = await supabase.auth.signInWithOAuth({ provider: 'google', options: {redirectTo: 'http://localhost:3000/auth/confirm'} });
  if (data.url) {
    redirect(data.url)
  }
};