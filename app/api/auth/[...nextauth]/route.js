import { firestore } from "firebase-admin";
import NextAuth from "next-auth";
import SlackProvider from "next-auth/providers/slack";

async function createUserInFirestore(user) {
    const { email, name, image } = user;
    
    try {
      // Check if user already exists
      const userRef = firestore.collection('users').doc(email);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        // Create new user document
        await userRef.set({
          email,
          name,
          profileImage: image,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          boards: [], // Initialize empty boards array
          role: 'member'
        });
  
        console.log(`New user created: ${email}`);
      } else {
        // Update last login time for existing user
        await userRef.update({
          lastLogin: new Date().toISOString()
        });
      }
  
      return true;
    } catch (error) {
      console.error("Error creating/updating user in Firestore:", error);
      return false;
    }
  }
  

const handler = NextAuth({
  providers: [
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      authorization: {
        params: { 
          scope: ["openid","profile","email"],
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      session.accessToken = token.accessToken;
      // Call the firebase admin SDK to create a new user in Firestore
      return session;
    },
    // async redirect({ url, baseUrl }) {
    //     // Always redirect to dashboard after successful authentication
    //     return `${baseUrl}/dashboard`;
    // },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login'
  }
});

export { handler as GET, handler as POST };