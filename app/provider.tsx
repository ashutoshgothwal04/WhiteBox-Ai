// "use client"
// import { auth } from '@/configs/firebaseConfig';
// import { AuthContext } from '@/context/AuthContext';
// import { onAuthStateChanged, User } from 'firebase/auth';
// import React, { useContext, useEffect, useState } from 'react'

// interface AuthContextType {
//     user: User | null;
// }

// function Provider({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     const [user, setUser] = useState<User | null>(null);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             setUser(user);
//         });

//         return () => unsubscribe(); // Cleanup
//     }, []);

//     return (
//         <AuthContext.Provider value={{ user }}>
//             <div>
//                 {children}
//             </div>
//         </AuthContext.Provider>
//     )
// }

// // Custom hook to use auth
// export const useAuthContext = (): AuthContextType => {
//     const context = useContext(AuthContext);
//     if (!context) throw new Error("useAuth must be used within an AuthProvider");
//     return context;
// };

// export default Provider





// "use client";

// import { auth } from "@/configs/firebaseConfig";
// import { AuthContext } from "@/context/AuthContext";
// import { onAuthStateChanged, User } from "firebase/auth";
// import React, { useContext, useEffect, useState } from "react";

// interface AuthContextType {
//   user: User | null;
// }

// function Provider({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setUser(user);

//       // ✅ Sync with Drizzle if logged in
//       if (user) {
//         try {
//           const res = await fetch("/api/user", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               userEmail: user.email,
//               userName: user.displayName ?? "Unnamed User",
//             }),
//           });

//           const data = await res.json();
//           console.log("User synced with DB:", data);
//         } catch (error) {
//           console.error("Error syncing user to Drizzle DB:", error);
//         }
//       }
//     });

//     return () => unsubscribe(); // Cleanup
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user }}>
//       <div>{children}</div>
//     </AuthContext.Provider>
//   );
// }

// // Custom hook to use auth
// export const useAuthContext = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };

// export default Provider;



"use client";

import { ReactNode, useEffect, useState, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/configs/firebaseConfig";
import { AuthContext, AuthContextType } from "@/context/AuthContext";

function Provider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const res = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userEmail: firebaseUser.email,
              userName: firebaseUser.displayName ?? "Unnamed User",
            }),
          });

          const data = await res.json();
          console.log("✅ User synced with Drizzle DB:", data);
        } catch (err) {
          console.error("❌ Failed to sync user:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook to access auth
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
};

export default Provider;
