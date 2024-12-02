import Header from '@/components/header'
import React from 'react'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header/>
      <main className="px-3 lg:px-14">
        {children}
      </main>
    </>
  )
}
