import * as React from 'react';
import {format} from 'date-fns';
import {Calendar as CalendarIcon} from 'lucide-react';
import { SelectSingleEventHandler } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ptBR } from "date-fns/locale";

type DatePickerProps = {
  value?: Date;
  onChange?: SelectSingleEventHandler;
  disabled?: boolean;
};

export const DatePicker = ({ value, onChange, disabled }: DatePickerProps) => {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={disabled} variant='outline' className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}>
          <CalendarIcon className='size-4 mr-2' />
          {value ? format(value, 'PPP', {
            locale: ptBR
          }) : <span>Selecione uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar mode='single' selected={value} onSelect={onChange} disabled={disabled} initialFocus locale={ptBR} />
      </PopoverContent>
    </Popover>
  )
};