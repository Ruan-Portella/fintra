import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { TransactionForm, ApiFormValues } from './transaction-form';
import { Loader2 } from 'lucide-react';
import { useConfirm } from '@/hooks/use-confirm';
import { useOpenTransaction } from '../hooks/use-open-transaction';
import { useGetTransaction } from '../api/use-get-transaction';
import { useEditTransaction } from '../api/use-edit-transaction';
import { useDeleteTransaction } from '../api/use-delete-transaction';
import { useGetCategories } from '@/services/categories/api/use-get-categories';
import { useCreateCategory } from '@/services/categories/api/use-create-category';
import { useGetAccounts } from '@/services/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/services/accounts/api/use-create-accounts';

export default function EditTransactionSheet() {
  const { isOpen, onClose, id } = useOpenTransaction();
  const [ConfirmDialog, confirm] = useConfirm('Você tem certeza de que deseja excluir esta transação?', 'Você está prestes a excluir esta transação');

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = categoryQuery.data?.map((category: {name: string, id: string}) => ({
    label: category.name,
    value: category.id
  })) || [];

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = accountQuery.data?.map((account: {name: string, id: string}) => ({
    label: account.name,
    value: account.id
  })) || [];

  const isPending = editMutation.isPending || deleteMutation.isPending || categoryMutation.isPending || accountMutation.isPending || transactionQuery.isPending;
  const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading;

  const onSubmit = (values: ApiFormValues) => {
    editMutation.mutate({
      ...values,
      date: new Date(values.date).toISOString(),
      amount: +values.amount,
    }, {
      onSuccess: () => {
        onClose();
      }
    })
  };

  const defaultValues = transactionQuery.data ? {
    accountId: transactionQuery.data.accountId,
    categoryId: transactionQuery.data.categoryId ?? '',
    amount: transactionQuery.data.amount.toString(),
    date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
    payee: transactionQuery.data.payee,
    description: transactionQuery.data.description,
  } : {
    accountId: '',
    categoryId: '',
    amount: '',
    date: new Date(),
    payee: '',
    description: '',
  };

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='space-y-4'>
          <SheetHeader>
            <SheetTitle>Editar Transação</SheetTitle>
          </SheetHeader>
          <SheetDescription>
            Editar uma transação existente.
          </SheetDescription>
          {
            isLoading ? (
              <div className='absolute inset-0 flex items-center justify-center'>
                <Loader2 className='size-4 text-muted-foreground animate-spin' />
              </div>
            ) : (
              <TransactionForm
                id={id}
                onSubmit={onSubmit}
                disabled={isPending}
                categoryOptions={categoryOptions}
                onCreateCategory={onCreateCategory}
                accountOptions={accountOptions}
                onCreateAccount={onCreateAccount}
                defaultValues={defaultValues}
                onDelete={onDelete}
              />
            )
          }
        </SheetContent>
      </Sheet>
    </>
  );
};
