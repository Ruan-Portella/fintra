'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useDeleteTransaction } from '@/services/transactions/api/use-delete-transaction';
import { useOpenTransaction } from '@/services/transactions/hooks/use-open-transaction';
import { useConfirm } from '@/hooks/use-confirm';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';

type Props = {
  id: string;
  recurrenceDad?: string;
  date: Date;
}

export default function Actions({ id, recurrenceDad, date }: Props) {
  const [editRecurrence, setEditRecurrence] = useState<"all" | "mentions" | "none" | undefined>();
  const [ConfirmDialog, confirm] = useConfirm('Você tem certeza de que deseja excluir esta transação?', 'Você está prestes a excluir esta transação.', recurrenceDad, {
    onChange: (value: string) => {
      setEditRecurrence(value as 'all' | 'mentions' | 'none');
    },
    value: editRecurrence ?? 'none'
  });
  const deleteMutation = useDeleteTransaction(id);
  const { onOpen, onClose } = useOpenTransaction();

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate({
        id: id,
        editRecurrence: ok as 'all' | 'mentions' | 'none',
        recurrenceDad,
        date: new Date(date).toISOString()
      }, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  }

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='size-8 p-0'>
            <MoreHorizontal className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem disabled={deleteMutation.isPending} onClick={() => onOpen(id)}>
            <Edit className='size-4 mr-2' />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem disabled={deleteMutation.isPending} onClick={handleDelete}>
            <Trash className='size-4 mr-2' />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
