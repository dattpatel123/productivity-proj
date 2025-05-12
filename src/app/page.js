'use client';
import { signIn } from "next-auth/react";

export default function Home() {
  

  
  return (

      
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-black text-center text-align"> login page</h1> 
        <button onClick={() => signIn('google', {callbackUrl:'/dashboard'})} className="btn btn-success">  
        </button>
      </div>
    
  );
}
