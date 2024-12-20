"use client"

import * as z from "zod"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp } from "lucide-react"
import Actions from "./actions"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { AccountColumn } from "./accounts-column"
import { CategoryColumn } from "./category-column"
import { transactionsApiFormSchema } from "@/schemas"
import { ptBR } from "date-fns/locale"
import { StatusColumn } from "./status-column"

export type ResponseType = z.infer<typeof transactionsApiFormSchema>

export const columns: ColumnDef<ResponseType>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data
          {
            column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )
          }
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('date') as Date;

      return (
        <span className="ml-4">
          {format(date, 'dd MMMM, yyyy', { locale: ptBR })}
        </span>
      )
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categoria
          {
            column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )
          }
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span>
          <CategoryColumn category={row.original.category ?? ''} categoryId={row.original.categoryId} id={row.original.id ?? ''} />
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          {
            column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )
          }
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span>
          <StatusColumn status={row.original.status ?? ''} statusId={row.original.statusId || ''} id={row.original.id ?? ''} />
        </span>
      )
    },
  },
  {
    accessorKey: "payee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Beneficiário
          {
            column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )
          }
        </Button>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Valor
          {
            column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )
          }
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));

      return (
        <Badge variant={amount < 0 ? 'destructive' : 'primary'} className="text-xs font-medium px-3.5 py-2">
          {
            formatCurrency(amount)
          }
        </Badge>
      )
    },
  },
  {
    accessorKey: "account",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Conta
          {
            column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )
          }
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <AccountColumn account={row.original.account ?? ''} accountId={row.original.accountId} />
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <Actions id={row.original.id ?? ''} recurrenceDad={row.original.recurrenceDad ?? ''} date={row.original.date} />
  }
]
