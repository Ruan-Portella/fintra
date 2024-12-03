import { z } from 'zod';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
} from '@/components/ui/form';
import { Select } from '@/components/select';
import { DatePicker } from '@/components/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { AmountInput } from '@/components/amount-input';
import { convertAmountToMiliunits } from '@/lib/utils';
import { transactionsFormSchema, transactionsSchema, transactionsApiFormSchema } from '@/schemas';

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  description: z.string().nullable().optional(),
})

export type FormValues = z.infer<typeof transactionsFormSchema>;
export type ApiFromValues = z.infer<typeof transactionsSchema>;
export type ApiFormValues = z.infer<typeof transactionsApiFormSchema>;

type TransactionFormProps = {
  id?: string;
  defaultValues?: ApiFormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string, value: string }[];
  categoryOptions: { label: string, value: string }[];
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}: TransactionFormProps) => {
  const form = useForm<ApiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: ApiFormValues) => {
    const amountInMiliunits = convertAmountToMiliunits(values.amount);
    
    onSubmit({
      ...values,
      date: values.date,
      categoryId: values.categoryId ?? '',
      amount: `${amountInMiliunits}`
    });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 pt-4'>
        <FormField name='date' control={form.control} render={({ field }) => (
          <FormItem>
            <FormControl>
              <DatePicker value={field.value} onChange={field.onChange} disabled={disabled} />
            </FormControl>
          </FormItem>
        )} />
        <FormField name='accountId' control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor='name'>Conta</FormLabel>
            <FormControl>
              <Select placeholder='Selecione uma conta' options={accountOptions} onCreate={onCreateAccount} value={field.value} onChange={field.onChange} disabled={disabled} />
            </FormControl>
          </FormItem>
        )} />
        <FormField name='categoryId' control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor='name'>Categoria</FormLabel>
            <FormControl>
              <Select placeholder='Selecione uma categoria' options={categoryOptions} onCreate={onCreateCategory} value={field.value} onChange={field.onChange} disabled={disabled} />
            </FormControl>
          </FormItem>
        )} />
        <FormField name='payee' control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor='name'>Beneficiário</FormLabel>
            <FormControl>
              <Input disabled={disabled} placeholder='Adicione uma Beneficiário' {...field} />
            </FormControl>
          </FormItem>
        )} />
        <FormField name='amount' control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor='name'>Valor</FormLabel>
            <FormControl>
              <AmountInput {...field} disabled={disabled} placeholder='R$ 10,00' />
            </FormControl>
          </FormItem>
        )} />
        <FormField name='description' control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor='name'>Descrição</FormLabel>
            <FormControl>
              <Textarea  {...field} value={field.value ?? ''} disabled={disabled} placeholder='Descrição opcional' />
            </FormControl>
          </FormItem>
        )} />
        <Button className='w-full' disabled={disabled}>
          {
            id ? "Salvar mudanças" : "Criar transação"
          }
        </Button>
        {
          !!id && (
            <Button type='button' disabled={disabled} onClick={handleDelete} className='w-full' variant='outline'>
              <Trash className='size-4 mr-2' />
              Deletar transação
            </Button>
          )
        }
      </form>
    </Form>
  );
}