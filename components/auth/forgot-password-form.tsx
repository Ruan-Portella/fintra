"use client";
import React, { Suspense } from 'react'
import { useTransition } from 'react';
import { ForgotPasswordSchema, typeForgotPasswordSchema } from '@/schemas';
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
import { forgotPassword } from '@/actions/auth/actions';
import FormFeedback from '../form-feedback';

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');

  const form = useForm<typeForgotPasswordSchema>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  })

  const handleSubmit = async (values: typeForgotPasswordSchema) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      forgotPassword(values)
        .then((response: { error?: string; success?: string } | undefined) => {
          if (response) {
            setError(response.error);
            setSuccess(response.success);
          }
        })
    });
  }

  return (
    <CardWrapper headerLabel='Vamos te ajudar a recuperar sua senha!' backButtonLabel='Lembrou da senha?' backButtonHref='/auth/login'>
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
          </div>
          <Suspense>
            <FormFeedback message={error || success} type={error ? 'error' : 'success'} />
          </Suspense>
          <Button type='submit' className='w-full' disabled={isPending}>
            Redefinir senha
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
