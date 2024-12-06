'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from "next/headers";
import { createClient } from '@/utils/supabase/server'
import { ForgotPasswordSchema, LoginSchema, RegisterSchema, ResetPasswordSchema, typeForgotPasswordSchema, typeLoginSchema, typeRegisterSchema, typeResetPasswordSchema } from '@/schemas'
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
  const validatedData = RegisterSchema.safeParse(data)

  if (!validatedData.success) {
    return authErrors['INVALID_CREDENTIALS']
  }


  const { error } = await supabase.auth.signUp({
    ...data,
    options: {
      data: {
        full_name: data.name,
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
  const {data} = await supabase.auth.signInWithOAuth({ provider: 'github', options: {redirectTo: 'https://fintra-rosy.vercel.app/auth/confirm'} });
  if (data.url) {
    redirect(data.url)
  }
};

export const loginWithGoogle= async () => {
  const supabase = await createClient();
  const {data} = await supabase.auth.signInWithOAuth({ provider: 'google', options: {redirectTo: 'https://fintra-rosy.vercel.app/auth/confirm'} });
  if (data.url) {
    redirect(data.url)
  }
};

export const forgotPassword = async (data: typeForgotPasswordSchema) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const validatedData = ForgotPasswordSchema.safeParse(data)

  if (!validatedData.success) {
    return authErrors['INVALID_CREDENTIALS']
  }

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${origin}/auth/confirm?redirect_to=/auth/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return {error: 'Não foi possível enviar o e-mail de recuperação de senha', status: 500};
  }

  return {success: "Email de recuperação de senha enviado"};
};

export const resetPassword = async (data: typeResetPasswordSchema) => {
  const supabase = await createClient();
  const validatedData = ResetPasswordSchema.safeParse(data)
  const { password, password_confirmation } = data;

  if (!password || !password_confirmation) {
    return authErrors['INVALID_CREDENTIALS']
  }

  if (password !== password_confirmation) {
    return authErrors['PASSWORD_MISMATCH']
  }

  if (!validatedData.success) {
    return authErrors['INVALID_CREDENTIALS']
  }

  const { error } = await supabase.auth.updateUser({
    password: data.password,
  });

  if (error) {
    return {error: 'Não foi possível redefinar a senha', status: 500};
  }

  return signOutAction();
};