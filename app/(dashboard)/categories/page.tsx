'use client';
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNewCategory } from '@/services/categories/hooks/use-new-category';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { useGetCategories } from '@/services/categories/api/use-get-categories';
import { Skeleton } from '@/components/ui/skeleton';
import { useBulkDeleteCategories } from '@/services/categories/api/use-bulk-delete';

export default function Categories() {
  const newCategory = useNewCategory();
  const deleteCategories = useBulkDeleteCategories();
  const categoryQuery = useGetCategories();
  const categories = categoryQuery.data || [];

  const isDisabled = categoryQuery.isLoading || deleteCategories.isPending;

  if (categoryQuery.isLoading) {
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
          <CardTitle className='text-xl line-clamp-1'>Categorias</CardTitle>
          <Button onClick={newCategory.onOpen} size='sm'>
            <Plus className='size-4 mr-2' />
            Nova categoria
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={categories} filterKey='name' filterName='nome' onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteCategories.mutate({ ids });
          }} disabled={isDisabled} />
        </CardContent>
      </Card>
    </div>
  )
}
