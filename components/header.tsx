import React from 'react'
import { HeaderLogo } from './header-logo'
import Navigation from './navigation'
import WelcomeMsg from './welcome.msg'
import { Filters } from './filters'
import { createClient } from '@/utils/supabase/server'
import AvatarHeader from './avatar-header'

export default async function Header() {
  const supabase = await createClient()
  const user = await supabase.auth.getUser()

  return (
    <header className='bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500 to-teal-800 px-4 py-8 lg:px-14 pb-36'>
      <div className='max-w-screen-2xl mx-auto'>
        <div className='w-full flex items-center justify-between mb-14'>
          <div className='flex items-center lg:gap-x-16'>
            <HeaderLogo />
            <Navigation />
          </div>
          <AvatarHeader user={user} />
        </div>
        <WelcomeMsg />
        <Filters />
      </div>
    </header>
  )
}
