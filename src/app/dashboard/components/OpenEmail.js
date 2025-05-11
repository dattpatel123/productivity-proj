import React from 'react';

const OpenEmail = ({ email, onBackClick, formatTimestamp }) => {
  if (!email) {
    return <p>No email selected.</p>; // Handle case where no email is passed
  }
  
  return (
    <div className="p-4">
      <button onClick={onBackClick} className="mb-4">Back to Inbox</button>
      <h2 className="text-2xl font-bold mb-2">From: {email.sender}</h2>
      <p className="text-gray-600 mb-4">{formatTimestamp(email.timestamp)}</p>
      {/* WARNING: Rendering raw HTML can be dangerous. Sanitize email.htmlBody before using dangerouslySetInnerHTML in a production app. */}
      <div dangerouslySetInnerHTML={{ __html: email.htmlBody }}></div>
    </div>
  );
}

export default OpenEmail;
