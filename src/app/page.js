'use client';
import { signIn } from "next-auth/react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const session = useSession();
  if (session.status === 'authenticated') {
    router.push("/dashboard");
    return;
  }
  
  return (

      
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-black text-center text-align"></h1> 
        <button onClick={() => signIn('google', {callbackUrl:'/dashboard'})} className="btn btn-neutral">  
        Login</button>
        
      </div>
    
  );
}
