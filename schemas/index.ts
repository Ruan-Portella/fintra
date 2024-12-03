import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'Senha é obrigatório' }),
});

export type typeLoginSchema = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
});

export type typeRegisterSchema = z.infer<typeof RegisterSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
});

export type typeForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
  password_confirmation: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
});

export type typeResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;


export const accountsSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
});

export const accountsEditSchema = z.object({
  name: z.string(),
});

export const deleteAccounts = z.object({
  ids: z.array(z.string())
});

export const ResponseSchema = z.array(accountsSchema);