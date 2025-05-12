'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import { Home, Menu, Mail, Calendar, List, FileText, Router} from 'lucide-react';
import '../globals.css'
import HomeComponent from './components/HomeComponent';
import EmailComponent from './components/EmailComponent';  
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Import useRouter


export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter(); // Initialize router

  //Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]); // Dependency array includes status and router
  
  

  // Show loading state while session is loading
  if (status === 'loading') {
    return <p>Loading...</p>; // Or a spinner component
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  // Function to handle section click
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  return (


    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`p-4 ${isOpen ? 'w-64' : 'w-16'} transition-all`}>
        <button onClick={toggleSidebar} className="btn btn-ghost">
          <Menu />
        </button>
        <ul className={`space-y-2 ${isOpen ? 'w-64' : 'w-16'} transition-all`}>

        <li className="p-2 hover:bg-gray-700 rounded cursor-pointer " onClick={() => handleSectionClick('home')}> 
            {isOpen ? 'Home' : <Home size={20} className='text-base-content'/>}
          </li>

          <li className="p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => handleSectionClick('email')}> 
            {isOpen ? 'Email' : <Mail size={20} />}
          </li>

          <li className="p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => handleSectionClick('calendar')}> 
            {isOpen ? 'Calendar' : <Calendar size={20} />}
          </li>

          <li className="p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => handleSectionClick('todo')}> 
          {isOpen ? 'Todo' : <List size={20} />}
          </li>

          <li className="p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => handleSectionClick('notes')}> 
          {isOpen ? 'Notes' : <FileText size={20} />}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Dynamically render the content based on selected section */}
        {selectedSection === 'home' && (
          <HomeComponent />
        )}

        {selectedSection === 'email' && (
          <EmailComponent />
        )}

        {selectedSection === 'calendar' && (
          <div>
            <h2>Calendar</h2>
            <p>This is where calendar.</p>
          </div>
        )}

        {selectedSection === 'todo' && (
          <div>
            <h2>Todo</h2>
            <p>todo stuff.</p>
          </div>
        )}
        
        {selectedSection === 'notes' && (
          <div>
            <h2>notes</h2>
            <p>notes stuff.</p>
          </div>
        )}
      </div>
      
      
    </div>
    



  );
}
