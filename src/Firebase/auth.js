import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";


export const createUser = async (email, password) => {
    return createUserWithEmailAndPassword(auth,email,password);
};

export const signInUser = async (email, password) => {
    return signInWithEmailAndPassword(auth,email,password);
};

export const googleSignin =async () => {
  
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider);
    return result.user;
};

export const signOutUser = () => {
    return signOut(auth);
};


