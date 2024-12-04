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

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
});

export const categoryEditSchema = z.object({
  name: z.string(),
});

export const deleteCategory = z.object({
  ids: z.array(z.string())
});

export const ResponseCategorySchema = z.array(categorySchema);

export const transactionsSchema = z.object({
  id: z.string(),
  amount: z.number(),
  date: z.date(),
  payee: z.string(),
  accountId: z.string(),
  account: z.string(),
  categoryId: z.string(),
  category: z.string(),
  description: z.string(),
});

export const transactionsApiFormSchema = z.object({
  amount: z.string(),
  date: z.date(),
  payee: z.string(),
  recurrenceType: z.string().min(1, {
    message: "Você precisa selecionar um tipo de recorrência",
  }).nullable().optional(),
  recurrenceInterval: z.number().min(1, {
    message: "Você precisa selecionar um intervalo",
  }).nullable().optional(),
  recurrenceDad: z.string().nullable().optional(),
  has_recurrence: z.boolean().nullable().optional(),
  editRecurrence: z.enum(["all", "mentions", "none"], {
    required_error: "Você precisa selecionar uma opção",
  }).optional(),
  accountId: z.string(),
  categoryId: z.string(),
  description: z.string(),
});

export const transactionsFormSchema = z.object({
  id: z.string(),
  amount: z.string(),
  date: z.date(),
  payee: z.string(),
  accountId: z.string(),
  account: z.string(),
  categoryId: z.string(),
  category: z.string(),
  description: z.string(),
});

export const transactionsEditSchema = z.object({
  amount: z.number(),
  date: z.string(),
  payee: z.string(),
  accountId: z.string(),
  categoryId: z.string(),
  description: z.string(),
});

export const deleteTransactions = z.object({
  ids: z.array(z.string())
});

export const ResponseTransactionsSchema = z.array(transactionsSchema);