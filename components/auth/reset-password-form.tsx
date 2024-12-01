"use client";
import React from 'react'
import { useTransition } from 'react';
import { ResetPasswordSchema, typeResetPasswordSchema } from '@/schemas';
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
import { resetPassword } from '@/actions/auth/actions';
import FormFeedback from '../form-feedback';

export default function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');

  const form = useForm<typeResetPasswordSchema>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    }
  })

  const handleSubmit = async (values: typeResetPasswordSchema) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      resetPassword(values)
        .then((response: { error?: string; success?: string } | undefined) => {
          if (response) {
            setError(response.error);
            setSuccess(response.success);
          }
        })
    });
  }

  return (
    <CardWrapper headerLabel='Vamos te ajudar a recuperar sua senha!' backButtonLabel='Deseja ficar com a senha antiga?' backButtonHref='/'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField control={form.control} name='password' render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Senha</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} type='password' placeholder='******' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='password_confirmation' render={({ field }) => (
              <FormItem>
                <FormLabel>Confirme sua senha</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} type='password' placeholder='******' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormFeedback message={error || success} type={error ? 'error' : 'success'} />
          <Button type='submit' className='w-full' disabled={isPending}>
            Redefinir senha
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
