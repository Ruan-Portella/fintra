import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOutAction } from "../actions/auth/actions"; 

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return <div>
    <h1>Home</h1>
    <p>Welcome {data.user.user_metadata.first_name}</p>
    <form>
      <button formAction={signOutAction}>Logout</button>
    </form>
  </div>
}
