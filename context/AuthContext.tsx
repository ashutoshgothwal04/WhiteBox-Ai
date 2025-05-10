import { User } from "firebase/auth";
import { createContext } from "react";
interface AuthContextType {
    user: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);



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





// "use client";

// import { createContext, useEffect, useState, ReactNode } from "react";
// import { account } from "configs/appwriteConfig";

// export interface AuthContextType {
//   user: any | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   register: (email: string, password: string, name: string) => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<any | null>(null);

//   const login = async (email: string, password: string) => {
//     try {
//       await account.createEmailSession(email, password);
//       const user = await account.get();
//       setUser(user);
//     } catch (error) {
//       console.error("Login failed:", error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await account.deleteSession("current");
//       setUser(null);
//     } catch (error) {
//       console.error("Logout failed:", error);
