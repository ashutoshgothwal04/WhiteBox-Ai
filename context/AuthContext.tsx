// import { User } from "firebase/auth";
// import { createContext } from "react";
// interface AuthContextType {
//     user: User | null;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);



// "use client";

// import { createContext, useEffect, useState, ReactNode } from "react";
// import { User, onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/configs/firebaseConfig"; // make sure this exports your Firebase auth instance

// interface AuthContextType {
//   user: User | null;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//   // Firebase login listener
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       setUser(firebaseUser);

//       // ✅ When user logs in, send to backend
//       if (firebaseUser) {
//         try {
//           const res = await fetch("/api/user", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               userEmail: firebaseUser.email,
//               userName: firebaseUser.displayName ?? "Unnamed User",
//             }),
//           });

//           const data = await res.json();
//           console.log("User synced with Drizzle DB:", data);
//         } catch (err) {
//           console.error("Failed to create/sync user:", err);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };





import { createContext } from "react";
import { User } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
