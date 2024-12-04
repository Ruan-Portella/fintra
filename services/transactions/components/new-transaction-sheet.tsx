import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { useNewTransaction } from '../hooks/use-new-transaction';
import { TransactionForm, ApiFormValues } from './transaction-form';
import { useCreateTransaction } from '../api/use-create-transaction';
import { useCreateCategory } from '@/services/categories/api/use-create-category';
import { useGetCategories } from '@/services/categories/api/use-get-categories';
import { useGetAccounts } from '@/services/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/services/accounts/api/use-create-accounts';
import { Loader2 } from 'lucide-react';

export default function NewTransactionSheet() {
  const { isOpen, onClose } = useNewTransaction();

  const createMutation = useCreateTransaction();

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });

  const categoryOptions = Array.isArray(categoryQuery?.data) && categoryQuery?.data?.map((category: { id: string, name: string }) => ({
    label: category.name,
    value: category.id
  })) || [];
  
  const accountOptions = Array.isArray(accountQuery?.data) && accountQuery?.data?.map((account: { id: string, name: string }) => ({
    label: account.name,
    value: account.id
  })) || [];

  const isPending = createMutation.isPending || categoryMutation.isPending || accountMutation.isPending;

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  const onSubmit = (values: ApiFormValues) => {

    if (!values.has_recurrence) {
      values.has_recurrence = false;
      values.recurrenceInterval = undefined;
      values.recurrenceType = undefined;
    } else {
      values.recurrenceInterval = values.recurrenceInterval || 1;
      values.recurrenceType = values.recurrenceType || 'monthly';
    }

    createMutation.mutate({
      ...values,
      date: new Date(values.date).toISOString(),
      amount: +values.amount,
    }, {
      onSuccess: () => {
        onClose();
      }
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='space-y-4'>
        <SheetHeader>
          <SheetTitle>Nova Transação</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          Adicione uma nova transação para manter o controle de suas finanças.
        </SheetDescription>
        {
          isLoading ? (
            <div className='absolute inset-0 flex items-center justify-center'>
              <Loader2 className='size-4 text-muted-foreground animate-spin' />
            </div>
          ) : (
            <TransactionForm
              onSubmit={onSubmit}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )
        }
      </SheetContent>
    </Sheet>
  );
};
