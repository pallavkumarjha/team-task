import NextAuth from "next-auth";
import SlackProvider from "next-auth/providers/slack";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { redirect } from "next/navigation";

async function createUserInFirestore(user) {
    const { email, name, image } = user;
    
    try {
      // Reference to the user document
      const userRef = doc(db, 'users', email);
      
      // Check if user already exists
      const userSnapshot = await getDoc(userRef);
  
      if (!userSnapshot.exists()) {
        // Create new user document
        await setDoc(userRef, {
          email,
          name,
          profileImage: image,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          boards: [], // Initialize empty boards array
          role: 'member',
          status: 'active'
        });
  
        console.log(`New user created: ${email}`);
      } else {
        // Update last login time for existing user
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
          status: 'active'
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
      await createUserInFirestore(session.user);
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