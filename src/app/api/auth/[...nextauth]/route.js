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
    async jwt({ token, user, account, profile }) {
      // Add the Supabase user's UUID to the token
      if (user) {
        
        token.userId = user.id; // Supabase user's UUID is in user.id
      }
      // Persist the OAuth access_token and the provider user id to the JWT right after signin
      if (account) {
        token.accessToken = account.access_token;
        // token.id = account.providerAccountId; // We don't need the provider ID in the token for RLS
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, such as an access_token and user id (Supabase UUID)
      session.accessToken = token.accessToken;
      session.user.id = token.sub; // Use the Supabase UUID from token.sub
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
