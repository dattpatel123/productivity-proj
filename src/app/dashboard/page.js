'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import { Home, Menu, Mail, Calendar, List, FileText, Router} from 'lucide-react';
import '../globals.css'
import HomeComponent from './components/HomeComponent';
import EmailComponent from './components/EmailComponent';
import CalendarComponent from './components/CalendarComponent';
import NowPlayingButton from './components/NowPlayingButton';
import NowPlayingWidget from './components/NowPlayingWidget';
import NotesComponent from './components/NotesComponent'; // Import NotesComponent
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Import useRouter


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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  // Function to handle section click
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const toggleWidgetVisibility = () => {
    setIsWidgetVisible(!isWidgetVisible);
  };

  const iconSize = 20; // Set the icon size
  return (


    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`p-4 ${isOpen ? 'w-35' : 'w-20'} transition-all duration-400 ease-in-out flex flex-col justify-center space-y-3 bg-black`}>

          <button onClick={toggleSidebar} className={`p-2 btn btn-ghost flex justify-center rounded`}>
            {isOpen ? <Menu size={iconSize} /> : <Menu size={iconSize} />}
          </button>

          <button className={`p-2 btn btn-ghost rounded cursor-pointer ${isOpen ? 'flex justify-center' : 'flex justify-center'}`} onClick={() => handleSectionClick('home')}>
            {isOpen ? 'Home' : <Home size={iconSize} className=''/>}
          </button>

          <button className={`p-2 btn btn-ghost rounded cursor-pointer ${isOpen ? '' : 'flex justify-center'}`} onClick={() => handleSectionClick('email')}>
            {isOpen ? 'Email' : <Mail size={iconSize} />}
          </button>

          <button className={`p-2 btn btn-ghost rounded cursor-pointer ${isOpen ? '' : 'flex justify-center'}`} onClick={() => handleSectionClick('calendar')}>
            {isOpen ? 'Calendar' : <Calendar size={iconSize} />}
          </button>

          <button className={`p-2 btn btn-ghost rounded cursor-pointer ${isOpen ? '' : 'flex justify-center'}`} onClick={() => handleSectionClick('todo')}>
            {isOpen ? 'Todo' : <List size={iconSize} />}
          </button>

          <button className={`p-2 btn btn-ghost rounded cursor-pointer ${isOpen ? '' : 'flex justify-center'}`} onClick={() => handleSectionClick('notes')}>
            {isOpen ? 'Notes' : <FileText size={iconSize} />}
          </button>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-4"> {/* Removed relative positioning */}
          
          
          {/* Container for Now Playing Button and Widget */}
        <div className="p-4 flex flex-col items-end gap-2 relative">
          {/* Now Playing Button */}
          <NowPlayingButton onClick={toggleWidgetVisibility} />
          {/* Now Playing Widget (full-screen overlapping) */}
          {/* Now Playing Widget (small overlapping box) */}
          {isWidgetVisible && (
            <div className="absolute top-16 right-0 z-50 w-48">
              <NowPlayingWidget />
            </div>
          )}
        </div>

        



        {/* Dynamically render the content based on selected section */}
        {selectedSection === 'home' && (
          <HomeComponent />
        )}

        {selectedSection === 'email' && (
          <EmailComponent />
        )}

        {selectedSection === 'calendar' && (
          <div>
            <CalendarComponent />
          </div>
        )}

        {selectedSection === 'todo' && (
          <div>
            <h2>Todo</h2>
            <p>todo stuff.</p>
          </div>
        )}

        {selectedSection === 'notes' && (
          <NotesComponent /> // Render NotesComponent
        )}
      </div>


    </div>



  );
}
