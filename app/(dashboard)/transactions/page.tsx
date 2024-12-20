/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, RefreshCcw } from 'lucide-react';
import { useNewTransaction } from '@/services/transactions/hooks/use-new-transaction';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { useGetTransactions } from '@/services/transactions/api/use-get-transactions';
import { Skeleton } from '@/components/ui/skeleton';
import { useBulkDeleteTransactions } from '@/services/transactions/api/use-bulk-delete';
// import UploadButton from './upload-button';
import ImportCard from './import-card';
import { useSelectAccount } from '@/services/accounts/hooks/use-select-account';
import { toast } from 'sonner';
import { useBulkCreateTransactions } from '@/services/transactions/api/use-bulk-create';
import { useUpdatedTransaction } from '@/services/transactions/api/use-updated-transactions';

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
}

export default function Transactions() {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState<typeof INITIAL_IMPORT_RESULTS>(INITIAL_IMPORT_RESULTS);

  // const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
  //   setImportResults(results);
  //   setVariant(VARIANTS.IMPORT);
  // };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  }

  const newTransaction = useNewTransaction();
  const createTransactions = useBulkCreateTransactions();
  const deleteTransaction = useBulkDeleteTransactions();
  const transactionsQuery = useGetTransactions();
  const updateTransactions = useUpdatedTransaction();
  const transactions = transactionsQuery.data || [];

  const isDisabled = transactionsQuery.isLoading || deleteTransaction.isPending;

  const onSubmitImport = async (values: any) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error('Por favor, selecione uma conta para importar as transações.');
    }

    const data = values.map((value: any) => ({
      ...value,
      accountId: accountId as string,
    }))

    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      }
    });
  }

  if (transactionsQuery.isLoading) {
    return (
      <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
        <Card className='border-none drop-shadow-sm'>
          <CardHeader>
            <Skeleton className='h-8 w-48' />
          </CardHeader>
          <CardContent>
            <div className='h-[500px] w-full flex items-center justify-center'>
              <Loader2 className='size-6 text-slate-300 animate-spin' />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard data={importResults.data} onCancel={onCancelImport} onSubmit={onSubmitImport} />
      </>
    )
  }

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
          <CardTitle className='text-xl line-clamp-1'>
            Transações
          </CardTitle>
          <div className='flex flex-col lg:flex-row items-center gap-x-2 gap-y-2'>
            <Button onClick={newTransaction.onOpen} size='sm' className='w-full lg:w-auto'>
              <Plus className='size-4 mr-2' />
              Nova Transação
            </Button>
            <Button onClick={() => {
              updateTransactions.mutate();
            }} size='sm' className='w-full lg:w-auto'>
              <RefreshCcw className='size-4 mr-2' />
              Atualizar Transações
            </Button>
            {/* <UploadButton onUpload={onUpload} /> */}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={transactions} filterKey='payee' filterName='Beneficiário' onDelete={(row) => {
            const ids = row.map((r) => r.original.id).filter((id): id is string => id !== undefined);
            deleteTransaction.mutate({ ids });
          }} disabled={isDisabled} />
        </CardContent>
      </Card>
    </div>
  )
}
