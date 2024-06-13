"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  setDoc,
  deleteDoc,
  QuerySnapshot,
} from "firebase/firestore";
import { auth, db, getUserInfo } from "../firebase/firebase";

export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("there is not AuthProvider");
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userDB, setUserDB] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  const reauthenticateWithPassword = async (email, password) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No hay usuario actualmente autenticado.");
      }

      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);
      return true; // Reautenticación exitosa
    } catch (error) {
      console.error("Error al reautenticar con contraseña:", error);
      throw error; // Propagar el error para que sea manejado externamente
    }
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      let docUser = null;
      if (currentUser) {
        docUser = await getUserInfo(currentUser.uid);
      }

      setUserDB(docUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <authContext.Provider
      value={{
        signup,
        login,
        user,
        userDB,
        logout,
        loading,
        loginWithGoogle,
        reauthenticateWithPassword,
        resetPassword,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
