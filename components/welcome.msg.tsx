import { createClient } from '@/utils/supabase/server'

export default async function WelcomeMsg() {
  const supabase = await createClient()
  const user = await supabase.auth.getUser()

  return (
    <div className='space-y-2 mb-4'>
      {
        user.data.user && (
          <>
            <h2 className='text-2xl lg:text-4xl text-white font-medium'>
              Bem-vindo! {user.data.user.user_metadata.full_name} 👋
            </h2>
            <p className="text-sm lg:text-base text-[#89b6fb]">
              Esse é o seu painel de controle, aqui você pode visualizar e gerenciar suas transações.
            </p>
          </>
        )
      }
    </div>
  )
}
