'use client'; // This line is necessary for Next.js to treat this file as a client component
import React from 'react'
import Link from 'next/link';
import { useState } from 'react';
import { Home, Menu, Mail, Calendar, List, FileText } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const iconSize = 20; 
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

    return (
    

      <div className="flex h-full"> {/* Removed h-screen */}
      {/* Sidebar */}
      
      <div className={`p-4 ${isOpen ? 'w-35' : 'w-20'} transition-all duration-400 ease-in-out bg-base-300 `}> {/* Added flex-grow */}
      <div className="fixed top-1/2 transform -translate-y-1/2 flex flex-col space-y-3 items-center">

          <button onClick={toggleSidebar} className={`p-2 btn btn-ghost flex rounded`}>
            {isOpen ? <Menu size={iconSize} /> : <Menu size={iconSize} />}
          </button>

          <Link href="/dashboard" className={`p-2 btn btn-ghost rounded cursor-pointer ${isOpen ? 'flex justify-center' : 'flex justify-center'}`}>
            {isOpen ? 'Home' : <Home size={iconSize} className=''/>}
          </Link>

          <Link href="/dashboard/email" className={`p-2 btn btn-ghost rounded cursor-pointer ${isOpen ? '' : 'flex justify-center'}`}>
            {isOpen ? 'Email' : <Mail size={iconSize} />}
          </Link>

          <Link href="/dashboard/calendar" className={`p-2 btn btn-ghost rounded cursor-pointer ${isOpen ? '' : 'flex justify-center'}`}>
            {isOpen ? 'Calendar' : <Calendar size={iconSize} />}
          </Link>

          <Link href="/dashboard/todos" className={`p-2 btn btn-ghost rounded cursor-pointer ${isOpen ? '' : 'flex justify-center'}`}>
            {isOpen ? 'Todo' : <List size={iconSize} />}
          </Link>

          <Link href="/dashboard/notes" className={`p-2 btn btn-ghost rounded cursor-pointer ${isOpen ? '' : 'flex justify-center'}`}>
            {isOpen ? 'Notes' : <FileText size={iconSize} />}
          </Link>
        </div>
      </div>
      </div>
        


  )
}

export default Sidebar
