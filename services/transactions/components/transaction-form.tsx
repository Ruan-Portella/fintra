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
import { Select } from '@/components/creatable-select';
import { DatePicker } from '@/components/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { AmountInput } from '@/components/amount-input';
import { convertAmountToMiliunits } from '@/lib/utils';
import { transactionsFormSchema, transactionsSchema, transactionsApiFormSchema } from '@/schemas';
import { Checkbox } from '@/components/ui/checkbox';
import { InputSelect } from '@/components/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  description: z.string().nullable().optional(),
  has_recurrence: z.boolean().nullable().optional(),
  recurrenceType: z.string().min(1, {
    message: "Você precisa selecionar um tipo de recorrência",
  }).nullable().optional(),
  recurrenceInterval: z.number().min(1, {
    message: "Você precisa selecionar um intervalo",
  }).nullable().optional(),
  editRecurrence: z.enum(["all", "mentions", "none"], {
    required_error: "Você precisa selecionar uma opção",
  }).optional(),
})

export type FormValues = z.infer<typeof transactionsFormSchema>;
export type ApiFromValues = z.infer<typeof transactionsSchema>;
export type ApiFormValues = z.infer<typeof transactionsApiFormSchema>;

type TransactionFormProps = {
  id?: string;
  defaultValues?: ApiFormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: (values: ApiFormValues) => void;
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

  const handleDelete = (values: ApiFormValues) => {
    onDelete?.(values);
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
            <FormLabel htmlFor='accountId'>Conta</FormLabel>
            <FormControl>
              <Select placeholder='Selecione uma conta' options={accountOptions} onCreate={onCreateAccount} value={field.value} onChange={field.onChange} disabled={disabled} />
            </FormControl>
          </FormItem>
        )} />
        <FormField name='categoryId' control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor='categoryId'>Categoria</FormLabel>
            <FormControl>
              <Select placeholder='Selecione uma categoria' options={categoryOptions} onCreate={onCreateCategory} value={field.value} onChange={field.onChange} disabled={disabled} />
            </FormControl>
          </FormItem>
        )} />
        <FormField name='payee' control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor='payee'>Beneficiário</FormLabel>
            <FormControl>
              <Input disabled={disabled} placeholder='Adicione uma Beneficiário' {...field} />
            </FormControl>
          </FormItem>
        )} />
        <FormField name='amount' control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor='amount'>Valor</FormLabel>
            <FormControl>
              <AmountInput {...field} disabled={disabled} placeholder='R$ 10,00' />
            </FormControl>
          </FormItem>
        )} />
        <FormField name='description' control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor='description'>Descrição</FormLabel>
            <FormControl>
              <Textarea  {...field} value={field.value ?? ''} disabled={disabled} placeholder='Descrição opcional' />
            </FormControl>
          </FormItem>
        )} />
        {
          !id && (
            <FormField name='has_recurrence' control={form.control} render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox id="has_recurrence" checked={field.value ? field.value : false} onCheckedChange={field.onChange} disabled={disabled} />
                </FormControl>
                <FormLabel className='ml-2' htmlFor='has_recurrence'>Deseja repetir essa transação?</FormLabel>
              </FormItem>
            )} />
          )
        }
        {
          !id && form.watch('has_recurrence') && (
            <>
              <FormField name='recurrenceType' control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='recurrenceType'>Tipo de Recorrência</FormLabel>
                  <FormControl>
                    <InputSelect placeholder='Selecione um tipo de recorrência' options={[{ label: 'Mensal', value: 'monthly' }, { label: 'Semanal', value: 'weekly' }]} value={field.value} onChange={field.onChange} disabled={disabled} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField name='recurrenceInterval' control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='recurrenceInterval'>Intervalo de Recorrência</FormLabel>
                  <FormControl>
                    <Input type='number' disabled={disabled} placeholder='1' {...field} value={field.value ?? ''} onChange={(e) => {
                      if (e.target.value && Number(e.target.value) < 1) {
                        return field.onChange(1);
                      }

                      if (e.target.value && Number(e.target.value) > 24) {
                        return field.onChange(24);
                      }

                      field.onChange(Number(e.target.value) ?? 0);
                    }} />
                  </FormControl>
                </FormItem>
              )} />
            </>
          )
        }
        {
          id && form.formState.defaultValues?.recurrenceDad && (
            <FormField
              control={form.control}
              name="editRecurrence"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>
                    Atenção! Essa recorrência tem transações passadas ou futuras, como você deseja editar ou deletar?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="all" />
                        </FormControl>
                        <FormLabel className="font-normal ml-2">
                          Todas (incluindo as passadas)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="mentions" />
                        </FormControl>
                        <FormLabel className="font-normal ml-2">
                          Esta e as próximas
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="none" />
                        </FormControl>
                        <FormLabel className="font-normal ml-2">
                          Somente essa
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          )
        }
        <Button className='w-full' disabled={disabled}>
          {
            id ? "Salvar mudanças" : "Criar transação"
          }
        </Button>
        {
          !!id && (
            <Button type='button' disabled={disabled} onClick={form.handleSubmit(handleDelete)} className='w-full' variant='outline'>
              <Trash className='size-4 mr-2' />
              Deletar transação
            </Button>
          )
        }
      </form>
    </Form>
  );
}