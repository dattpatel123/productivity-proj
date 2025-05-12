// Helper function to decode base64url
export function decodeBase64Url(s) {
    return Buffer.from(s, 'base64').toString('utf-8');
  }

  // Helper function to get the plain text body from message parts
  export function getPlainTextBody(parts) {
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
  export function getHtmlBody(parts) {
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
  export function decodeHtmlEntities(str) {
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
