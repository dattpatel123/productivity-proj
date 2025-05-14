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
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and the user id to the JWT right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = account.providerAccountId; // Store the provider's user ID in the token
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, such as an access_token and user id from a JWT
      session.accessToken = token.accessToken;
      session.user.id = token.id; // Add the user ID from the token to the session user object
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
