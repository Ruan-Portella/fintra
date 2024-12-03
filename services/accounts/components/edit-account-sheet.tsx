import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { AccountForm, FormValues } from './account-form';
import { useOpenAccount } from '../hooks/use-open-account';
import { useGetAccount } from '../api/use-get-account';
import { Loader2 } from 'lucide-react';
import { useEditAccount } from '../api/use-edit-account';
import { useDeleteAccount } from '../api/use-delete-account';
import { useConfirm } from '@/hooks/use-confirm';

export default function EditAccountsSheet() {
  const { isOpen, onClose, id } = useOpenAccount();
  const [ConfirmDialog, confirm] = useConfirm('Você tem certeza de que deseja excluir esta conta?', 'Você está prestes a excluir esta conta');

  const accountQuery = useGetAccount(id);
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    })
  };

  const defaultValues = accountQuery.data ? {
    name: accountQuery.data.name,
  } : {
    name: '',
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
            <SheetTitle>Editar conta</SheetTitle>
          </SheetHeader>
          <SheetDescription>
            Editar uma conta existente.
          </SheetDescription>
          {
            isLoading ? (
              <div className='absolute inset-0 flex items-center justify-center'>
                <Loader2 className='size-4 text-muted-foreground animate-spin' />
              </div>
            ) : (
              <AccountForm id={id} onSubmit={onSubmit} disabled={isPending} defaultValues={defaultValues} onDelete={onDelete} />
            )
          }
        </SheetContent>
      </Sheet>
    </>
  );
};
