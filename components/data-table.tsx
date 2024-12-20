"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  Row
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "./ui/button"
import { Input } from "@/components/ui/input"
import { Trash } from "lucide-react"
import { useConfirm } from "@/hooks/use-confirm"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  filterKey: string,
  filterName: string,
  onDelete: (rows: Row<TData>[]) => void,
  disabled?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  filterName,
  onDelete,
  disabled,
}: DataTableProps<TData, TValue>) {
  const [ConfirmDialog, confirm] = useConfirm('Você tem certeza?', 'Essa ação não pode ser desfeita.')
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection
    },
  })

  return (
    <div>
      <ConfirmDialog />
      <div className="flex items-center py-4">
        <Input
          placeholder={`Filtrar ${filterName}...`}
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {
          table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button onClick={async () => {
              const ok = await confirm();

              if (ok) {
                onDelete(table.getFilteredSelectedRowModel().rows)
                table.resetRowSelection()
              }
            }} disabled={disabled} size='sm' variant='outline' className="ml-auto font-normal text-xs">
              <Trash className="mr-2 size-4" />
              Deletar ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )
        }
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={cell.id} style={{ paddingLeft: index >= 1 ? '2rem' : '1rem' }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            Linhas por página:
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-9 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="w-2">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}
