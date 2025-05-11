import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route'; // Adjust the path as necessary
import he from 'he'; // Import he for HTML entity decoding

// Helper function to decode base64url
function decodeBase64Url(s) {
  return Buffer.from(s, 'base64').toString('utf-8');
}

// Helper function to get the plain text body from message parts
function getPlainTextBody(parts) {
  let body = '';
  if (parts) {
    for (const part of parts) {
      if (part.mimeType === 'text/plain' && part.body && part.body.data) {
        body += decodeBase64Url(part.body.data);
      } else if (part.parts) {
        body += getPlainTextBody(part.parts);
      }
    }
  }
  return body;
}

// Helper function to get the HTML body from message parts
function getHtmlBody(parts) {
  let body = '';
  if (parts) {
    for (const part of parts) {
      if (part.mimeType === 'text/html' && part.body && part.body.data) {
        body += decodeBase64Url(part.body.data);
      } else if (part.parts) {
        body += getHtmlBody(part.parts);
      }
    }
  }
  return body;
}

// Helper function to decode basic HTML entities
function decodeHtmlEntities(str) {
  const entities = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    '&#39;': "'",
    // Add more entities as needed
  };
  return str.replace(/&|<|>|"|&#39;/g, match => entities[match]);
}


export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return new Response("Not Authenticated", { status: 401 });
  }

  try {
    // Set up the Gmail API client with the OAuth token
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const gmail = google.gmail({ version: 'v1', auth });
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,  // Get the latest 10 emails
    });


    const messages = response.data.messages || [];

    const emailDetails = await Promise.all(
      messages.map(async (message) => {
        // Fetch the email details
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });

        const headers = email.data.payload.headers;
        const sender = headers.find(header => header.name === 'From')?.value;
        const timestamp = headers.find(header => header.name === 'Date')?.value;
        const subject = headers.find(header => header.name === 'Subject')?.value || "No Subject";
        
        const htmlBody = getHtmlBody(email.data.payload.parts || [email.data.payload]); // Get HTML body
        const snippet = he.decode(email?.data?.snippet || ""); // Decode snippet


        return {
          id: email.data.id,
          snippet: snippet, // Use the decoded snippet
          sender: sender,
          timestamp: timestamp,
          htmlBody: htmlBody, // Include HTML body
          subject: subject
        };
      })
    );



    return new Response(JSON.stringify(emailDetails), { status: 200 });
  } catch (error) {
    console.error("Error fetching emails:", error); // Log the full error
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
