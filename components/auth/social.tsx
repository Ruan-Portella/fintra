"use client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { loginWithGithub, loginWithGoogle } from "@/actions/auth/actions";


export default function Social() {

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size='lg' className="w-full" variant='outline' onClick={() => loginWithGoogle()}>
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button size='lg' className="w-full" variant='outline' onClick={() => loginWithGithub()}>
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  )
}
