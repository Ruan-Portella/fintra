import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import {addDays, format, subDays } from 'date-fns'
import qs from 'query-string';

type NavButtonProps = {
  href: string
  label: string
  isActive?: boolean
}

export default function NavButton({
  href,
  label,
  isActive
}: NavButtonProps) {
  const pathname = href;
  
  const params = useSearchParams();
  const from = params.get('from') || '';
  const to = params.get('to') || '';

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const dateState = {
    from: from ? addDays(new Date(from), 1) : defaultFrom,
    to: to ? addDays(new Date(to), 1) : defaultTo
  }

  const query = {
    from: format(dateState?.from || defaultFrom, 'yyyy-MM-dd'),
    to: format(dateState?.to || defaultTo, 'yyyy-MM-dd'),
  };

  const url = qs.stringifyUrl({
    url: pathname,
    query
  }, { skipNull: true, skipEmptyString: true });

  return (
    <Button asChild size='sm' variant='outline' className={cn('w-full lg:w-auto justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition', isActive ? 'bg-white/10' : 'bg-transparent')}>
      <Link href={url}>
        {label}
      </Link>
    </Button>
  )
}
