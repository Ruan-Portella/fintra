"use client"
import React from 'react'
import { AvatarFallback, AvatarImage, Avatar } from './ui/avatar'
import { Skeleton } from './ui/skeleton'
import { UserResponse } from '@supabase/supabase-js'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { LogOut } from 'lucide-react'
import { signOutAction } from '@/actions/auth/actions'


export default function AvatarHeader({ user }: { user: UserResponse }) {

  if (user.error) {
    <Skeleton className='w-6' />
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className='cursor-pointer'>
          {
            user.data.user && user.data.user.user_metadata.avatar_url && <AvatarImage src={user.data.user.user_metadata.avatar_url} alt='Usuário' />
          }
          {
            !user.data.user || !user.data.user.user_metadata.avatar_url && <AvatarFallback>U</AvatarFallback>
          }
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className='lg:w-auto p-0 flex z-50 border-none' align='end'>
        <div className='bg-white border-none mt-1 rounded-md w-[23.5rem] shadow-lg'>
          <div className='w-full py-4 px-5 gap-4 flex flex-col'>
            <div className='flex flex-row gap-4 w-full'>
              <div>
                <Avatar className='cursor-pointer'>
                  {
                    user.data.user && user.data.user.user_metadata.avatar_url && <AvatarImage src={user.data.user.user_metadata.avatar_url} />
                  }
                  {
                    !user.data.user || !user.data.user.user_metadata.avatar_url && <AvatarFallback>U</AvatarFallback>
                  }
                </Avatar>
              </div>
              <div>
                <h1 className='text-base font-medium -mb-1'>{user.data.user?.user_metadata.full_name}</h1>
                <p className='text-sm text-gray-800'>{user.data.user?.email}</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col w-full items-start'>
            {/* <Separator className='w-full' />
            <div className='w-full cursor-pointer p-1 hover:bg-accent hover:text-accent-foreground'>
              <Button variant='none' className='px-5'>
                <Settings />
                Gerenciar conta
              </Button>
            </div> */}
            <Separator className='w-full' />
            <div className='w-full cursor-pointer p-1 hover:bg-accent hover:text-accent-foreground rounded-e-md rounded-s-md'>
              <Button variant='none' onClick={() => signOutAction()} className='px-5 border-none border-transparent decoration-transparent w-full flex justify-start'>
                <LogOut />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
