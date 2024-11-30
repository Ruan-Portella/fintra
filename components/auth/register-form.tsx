"use client";
import React from 'react'
import { useTransition } from 'react';
import { RegisterSchema, typeRegisterSchema } from '@/schemas';
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
import { register } from '@/actions/auth/actions';
import FormFeedback from '../form-feedback';


export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');

  const form = useForm<typeRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  })

  const handleSubmit = async (values: typeRegisterSchema) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      register(values)
        .then((response: { error?: string; success?: string } | undefined) => {
          if (response) {
            setError(response.error);
            setSuccess(response.success);
          }
        })
    });
  }

  return (
    <CardWrapper headerLabel='Crie sua conta' backButtonLabel='Já tem uma conta?' backButtonHref='/auth/login' showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField control={form.control} name='name' render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} type='text' placeholder='Ruan Portella' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
          </div>
          <FormFeedback message={error || success} type={error ? 'error' : 'success'} />
          <Button type='submit' className='w-full' disabled={isPending}>
            Criar conta
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
