'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import { Home, Menu, Mail, Calendar, List, FileText, Router} from 'lucide-react';
import '../globals.css'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Link from 'next/link';


export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState('');
  const [isWidgetVisible, setIsWidgetVisible] = useState(false); // State for widget visibility
  const { data: session, status } = useSession();
  const router = useRouter(); // Initialize router

  //Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
    
  }, [status, router]); // Dependency array includes status and router

  // Log session object when it changes
  useEffect(() => {
    console.log('Session object:', session);
      
  }, [session]); // Dependency array includes session


  // Show loading state while session is loading
  if (status === 'loading') {
    return <p>Loading...</p>; // Or a spinner component
  }

  

  

  const iconSize = 20; // Set the icon size
  return (

    <div className='flex justify-center items-center h-screen'>
    Welcome
    </div>
      

       




  );
}
