import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly', // Gmail read-only access
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;  // Save the access token to the JWT
        token.accessTokenExpires = Date.now() + account.expires_in * 1000;
        
      }
      // Check if token has expired
      if (Date.now() < token.accessTokenExpires) {
        return token; // Still valid
      }

      // If the token is expired or no new account was provided, return the existing token
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;  // Add access token to session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
