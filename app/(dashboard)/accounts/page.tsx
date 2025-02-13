'use client';
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNewAccount } from '@/services/accounts/hooks/use-new-account';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { useGetAccounts } from '@/services/accounts/api/use-get-accounts';
import { Skeleton } from '@/components/ui/skeleton';
import { useBulkDeleteAccounts } from '@/services/accounts/api/use-bulk-delete';

export default function Accounts() {
  const newAccount = useNewAccount();
  const deleteAccounts = useBulkDeleteAccounts();
  const accountsQuery = useGetAccounts();
  const accounts = accountsQuery.data || [];

  const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

  if (accountsQuery.isLoading) {
    return (
      <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
        <Card className='border-none drop-shadow-sm'>
          <CardHeader>
            <Skeleton className='h-8 w-48' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-[500px] w-full' />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
          <CardTitle className='text-xl line-clamp-1'>Contas</CardTitle>
          <Button onClick={newAccount.onOpen} size='sm'>
            <Plus className='size-4 mr-2' />
            Nova conta
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={accounts} filterKey='name' filterName='nome' onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteAccounts.mutate({ ids });
          }} disabled={isDisabled} />
        </CardContent>
      </Card>
    </div>
  )
}
