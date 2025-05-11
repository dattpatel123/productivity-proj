'use client';
import { useState, useEffect } from 'react'; // Keep useState for selectedEmail
import { useSession, signIn, signOut } from 'next-auth/react';
import OpenEmail from './OpenEmail'; // Import the OpenEmail component
import useEmailStore from '@/store/emailStore'; // Import the Zustand store hook

export default function EmailComponent() {
  const { data: session } = useSession();
  // Use state and actions from the Zustand store
  const { emails, loading, error, fetchEmails } = useEmailStore();
  const [selectedEmail, setSelectedEmail] = useState(null); // State to track selected email

  // Fetch emails when the component mounts and session is available
  useEffect(() => {
    if (!session) return; // Don't fetch emails if session is not available
    if (emails.length > 0) return; // Don't fetch emails if already fetched
    fetchEmails(session);
  }, [session, fetchEmails]); // Dependency array includes session and fetchEmails action

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const handleBackClick = () => {
    setSelectedEmail(null);
  };
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


  if (!session) {
    return <button onClick={() => signIn('google')}>Sign In with Google</button>;
  }

  // Display loading, error, or email list/detail view
  if (loading) {
    return <p>Loading emails...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <button onClick={() => signOut()}>Sign Out</button>
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

          {emails.map((email) => (
            <div
              key={email.id}
              className="p-2 border border-gray-300 hover:bg-gray-300 rounded-md space-y-2"
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
