"use client";
import React, { Suspense } from 'react'
import { useTransition } from 'react';
import { LoginSchema, typeLoginSchema } from '@/schemas';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CardWrapper } from './card-wrapper'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { login } from '@/actions/auth/actions';
import FormFeedback from '../form-feedback';
import Link from 'next/link';


export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');

  const form = useForm<typeLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const handleSubmit = async (values: typeLoginSchema) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      login(values)
        .then((response: { error?: string; success?: string } | undefined) => {
          if (response) {
            setError(response.error);
            setSuccess(response.success);
          }
        })
    });
  }

  return (
    <CardWrapper headerLabel='Bem vindo de volta!' backButtonLabel='Não tem uma conta?' backButtonHref='/auth/register' showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField control={form.control} name='email' render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} type='email' placeholder='Email' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='password' render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} type='password' placeholder='******' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button variant='link' className="font-normal px-0" size='sm' asChild>
              <Link href={'/auth/forgot-password'}>
                Esqueceu sua senha?
              </Link>
            </Button>
          </div>
          <Suspense>
            <FormFeedback message={error || success} type={error ? 'error' : 'success'} />
          </Suspense>
          <Button type='submit' className='w-full' disabled={isPending}>
            Entrar
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
