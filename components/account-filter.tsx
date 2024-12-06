'use client';
import * as z from "zod";
import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem
} from '@/components/ui/select'
import qs from 'query-string';
import {
  usePathname,
  useRouter,
  useSearchParams
} from 'next/navigation';
import { useGetAccounts } from '@/services/accounts/api/use-get-accounts';
import { useGetSummary } from '@/services/summary/api/use-get-summary';

const Accounts = z.object({
  id: z.string(),
  name: z.string()
});

export type Accounts = z.infer<typeof Accounts>;

export default function AccountFilter() {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const accountId = params.get('accountId') || 'all';
  const from = params.get('from') || '';
  const to = params.get('to') || '';

  const {isLoading: isLoadingSummary} = useGetSummary();
  const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts();

  const onChange = (newValue: string) => {
    const query = {
      accountId: newValue,
      from,
      to
    };

    if (newValue === 'all') {
      query.accountId = '';
    }

    const url = qs.stringifyUrl({
      url: pathname,
      query
    }, {skipNull: true, skipEmptyString: true});

    router.push(url);
  }

  return (
    <Select value={accountId} onValueChange={onChange} disabled={isLoadingAccounts || isLoadingSummary}>
      <SelectTrigger className='lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition'>
        <SelectValue placeholder='Select account' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>
          Todas as contas
        </SelectItem>
        {
         Array.isArray(accounts) && accounts?.map((account: Accounts) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  )
}
