"use client";
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import NavButton from './nav-button';
import { useMedia } from 'react-use'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { useSearchParams } from 'next/navigation'
import { addDays, format, subDays } from 'date-fns'
import qs from 'query-string';

const routes = [
  {
    href: '/',
    label: 'Visão geral'
  },
  {
    href: '/transactions',
    label: 'Transações'
  },
  {
    href: '/accounts',
    label: 'Contas'
  },
  {
    href: '/categories',
    label: 'Categorias'
  },
  // {
  //   href: '/settings',
  //   label: 'Settings'
  // }
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const isMobile = useMedia('(max-width: 1024px)', false);

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  }

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button variant='outline' size='sm' className='font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition'>
            <Menu className='h-4 w-4' />
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='px-2' >
          <nav className='flex flex-col gap-y-2 pt-6'>
            {
              routes.map((route) => {
                const pathnameHref = route.href;

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
                  url: pathnameHref,
                  query
                }, { skipNull: true, skipEmptyString: true });

                return (
                  <Button key={route.href} variant={route.href === pathname ? 'secondary' : 'ghost'} onClick={() => onClick(url)} className='w-full justify-start'>
                    {route.label}
                  </Button>
                )
              })
            }
          </nav>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <nav className='hidden lg:flex items-center gap-x-2 overflow-x-auto'>
      {
        routes.map((route) => (
          <NavButton
            key={route.href}
            href={route.href}
            label={route.label}
            isActive={pathname === route.href}
          />
        ))
      }
    </nav>
  )
}
