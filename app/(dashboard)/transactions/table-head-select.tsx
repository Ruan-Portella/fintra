import React from 'react'
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type Props = {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
}

const options = [
  {
    label: 'Valor',
    value: 'amount'
  },
  {
    label: 'Beneficiário',
    value: 'payee'
  },
  {
    label: 'Data',
    value: 'date'
  }
]

export default function TableHeadSelect({
  columnIndex,
  selectedColumns,
  onChange
}: Props) {
  const currenctSelect = selectedColumns[`column_${columnIndex}`];

  return (
    <Select value={currenctSelect || ""} onValueChange={(value) => onChange(columnIndex, value)}>
      <SelectTrigger className={cn('focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize', currenctSelect && 'text-blue-500')}>
        <SelectValue placeholder='Pular' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='skip'>Pular</SelectItem>
        {
          options.map((option, index) => {
            const disabled = Object.values(selectedColumns).includes(option.value) && selectedColumns[`column_${columnIndex}`] !== option.value;

            return (
              <SelectItem key={index} value={option.value} disabled={disabled} className='capitalize'>{option.label}</SelectItem>
            )
          })
        }
      </SelectContent>
    </Select>
  )
}
