// import { useSession } from "next-auth/react";
// import { getServerSession } from "next-auth";
// import { useEffect } from "react";
// import { useMemo } from "react";

// export async function useSessionData() {
//     const session = await getServerSession();
//     console.log('session', session)
// //   const { data: session, status } = useSession();

// //   useEffect(() => {
// //     if (status === "authenticated" && session) {
      
// //     }
// //   }, [session, status])

// //   const getSession = async () => {
    
// //     return session;
// //   }
//     // const session = await getServerSession();


// //   const userData = useMemo(() => {
// //     if (status === "authenticated" && session) {
// //       return {
// //         id: session.user.id,
// //         name: session.user.name,
// //         email: session.user.email,
// //         image: session.user.image,
// //         accessToken: session.accessToken
// //       };
// //     }
// //     return null;
// //   }, [session, status]);

//   return {
//     user: session,
//     isAuthenticated: status === "authenticated",
//     isLoading: status === "loading",
//     isUnauthenticated: status === "unauthenticated"
//   };
// }


"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";

export function useSessionData() {
  const { data: session } = useSession();

  const userData = useMemo(() => {
    if (session?.user) {
      return {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        accessToken: session.accessToken
      };
    }
    return null;
  }, [session]);

  return {
    user: userData,
    session: session
  };
}