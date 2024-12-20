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
import { useGetStatus } from '@/services/status/api/use-get-status';

export default function EditTransactionSheet() {
  const { isOpen, onClose, id } = useOpenTransaction();
  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = Array.isArray(categoryQuery?.data) && categoryQuery.data?.map((category: { name: string, id: string }) => ({
    label: category.name,
    value: category.id
  })) || [];

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = Array.isArray(accountQuery?.data) && accountQuery.data?.map((account: { name: string, id: string }) => ({
    label: account.name,
    value: account.id
  })) || [];

  const statusQuery = useGetStatus();
  const statusOptions = Array.isArray(statusQuery?.data) && statusQuery?.data?.map((status: { id: string, name: string }) => ({
    label: status.name,
    value: status.id
  })) || [];

  const isPending = editMutation.isPending || deleteMutation.isPending || categoryMutation.isPending || accountMutation.isPending || transactionQuery.isPending;
  const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading;

  const [ConfirmDialog, confirm] = useConfirm('Você tem certeza de que deseja excluir esta transação?', 'Atenção! Essa recorrência tem transações passadas ou futuras.');

  const onSubmit = (values: ApiFormValues) => {
    if (!transactionQuery.data.recurrenceDad) {
      values.recurrenceDad = undefined;
      values.editRecurrence = undefined;
    } else {
      values.editRecurrence = values.editRecurrence || 'all';
      values.recurrenceDad = transactionQuery.data.recurrenceDad;
    }
    const statusId = values.statusId || '';

    editMutation.mutate({
      ...values,
      date: new Date(values.date).toISOString(),
      amount: +values.amount,
      statusId
    }, {
      onSuccess: () => {
        onClose();
      }
    })
  };

  const defaultValues = transactionQuery.data ? {
    accountId: transactionQuery.data.accountId,
    categoryId: transactionQuery.data.categoryId ?? '',
    statusId: transactionQuery.data.statusId,
    amount: transactionQuery.data.amount.toString(),
    date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
    payee: transactionQuery.data.payee,
    description: transactionQuery.data.description,
    editRecurrence: 'none' as const,
    recurrenceDad: transactionQuery.data.recurrenceDad,
  } : {
    accountId: '',
    categoryId: '',
    statusId: '',
    amount: '',
    date: new Date(),
    payee: '',
    description: '',
    recurrenceDad: '',
  };

  const onDelete = async (values: ApiFormValues) => {
    const ok = await confirm();
    if (!transactionQuery.data.recurrenceDad) {
      values.recurrenceDad = undefined;
      values.editRecurrence = undefined;
    } else {
      values.editRecurrence = values.editRecurrence || 'all';
      values.recurrenceDad = transactionQuery.data.recurrenceDad;
    }
    if (ok) {
      deleteMutation.mutate({
        id: id,
        editRecurrence: values.editRecurrence,
        recurrenceDad: values.recurrenceDad,
        date: new Date(values.date).toISOString()
      }, {
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
        <SheetContent className='space-y-4' style={{
          overflowY: 'auto'
        }}>
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
                statusOptions={statusOptions}
              />
            )
          }
        </SheetContent>
      </Sheet>
    </>
  );
};
