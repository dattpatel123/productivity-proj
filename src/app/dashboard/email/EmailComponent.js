'use client';
import { useState, useEffect } from 'react'; // Keep useState for selectedEmail
import { useSession, signIn, signOut } from 'next-auth/react';
import OpenEmail from './OpenEmail'; // Import the OpenEmail component
import useEmailStore from '@/store/emailStore'; // Import the Zustand store hook
import { useRouter } from 'next/navigation'
// fix signing out with router

export default function EmailComponent() {
  
  // Use state and actions from the Zustand store
  const { emails, loading, error, fetchEmails } = useEmailStore();
  const [selectedEmail, setSelectedEmail] = useState(null); // State to track selected email
  const { data: session, status } = useSession(); // Get session data from NextAuth
  const router = useRouter(); // Initialize router for redirection
  // Fetch emails when the component mounts and session is available
  console.log(session)
  useEffect(() => {
    if (status === 'authenticated' && emails.length === 0) {
      fetchEmails();
    } else if (status === 'unauthenticated') {
       router.push('/'); // Keep commented out for now as router is commented out
    }

  }, [fetchEmails, status, emails.length]); // Dependency array includes fetchEmails action, status, and emails.length

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const handleBackClick = () => {
    setSelectedEmail(null);
  };
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' }); // Sign out and redirect to the login page
    resetStore();
    useEmailStore.setState({ loading: false });
  }
  const formatTimestamp = (timestamp) => {
    const formattedDate = new Date(timestamp).toLocaleString("en-US", {
      weekday: "short",  // Mon, Tue, Wed...
      year: "numeric",   // 2025
      month: "short",    // Jan, Feb, Mar...
      day: "2-digit",    // 01, 02, 03...
      hour: "2-digit",   // 01, 02, 03...
      minute: "2-digit", // 00, 15, 30...
      hour12: true,      // 12-hour format
    });
    return formattedDate
  }

  
  
  
  // If session exists, display loading, error, or email list/detail view
  if (loading && emails.length === 0) {

      return (
        
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-infinity loading-xl w-30 c"></span>
        </div>
      )
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <button onClick={handleSignOut} className="btn btn-error">Sign Out</button> {/* Call signOut and resetStore */}
      <h2 className="text-2xl font-bold text-center">Inbox</h2>

      {selectedEmail ? (  
        // Render OpenEmail component if an email is selected
        <OpenEmail email={selectedEmail} onBackClick={handleBackClick} formatTimestamp={formatTimestamp}/>
      ) : (
        // Render email list if no email is selected
        emails.length === 0 ? (
          <p>No emails found</p>
        ) : (
          
          <div className="space-y-5 mt-7">
            <button onClick={fetchEmails} className="btn btn-success">Refresh</button> {/* Call signOut and resetStore */}
          {emails.map((email) => (
            <div
              key={email.id}
              className="cursor-pointer p-4 hover:bg-base-200 flex flex-col rounded-lg border-2 border-primary-content"
              onClick={() => handleEmailClick(email)}

            >
              <div className='flex justify-between'>
                <p><strong>Sender:</strong> {email.sender}</p>
                <p>{formatTimestamp(email.timestamp)} </p>

              </div>
              <p><strong>Subject:</strong> {email.subject}</p>
              <p><strong>Snippet:</strong> {email.snippet}</p>

            </div>
          ))}
          </div>
          )
      )}
    </div>
  );
}
