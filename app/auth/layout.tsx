import React from 'react'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='h-full flex overflow-auto items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-teal-400'>
      {children}
    </div>
  )
}
