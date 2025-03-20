import React,{ useContext, useEffect, useState } from "react";
import { auth } from "../Firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth (){
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    //user logs in info is stored
  const [currentUser,setCurrentUser] = useState(null);
  //user logged in it will be set to true
  const [userLoggedIn,setUserLoggedIn] =useState(false);
  const [loading,setLoading] =useState(true);

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, initializeUser)
    return unsubscribe
  },[])
  //once logged in give user info as argument
  async function initializeUser(user) {
    if (user) {
        setCurrentUser({...user});
        setUserLoggedIn(true)
    }else{
        setCurrentUser(null);
        setUserLoggedIn(false);
    }
    setLoading(false);
  }
  //expose current user,if user is loggedin or not and the loading state
  const value ={
    currentUser,userLoggedIn,loading
  }
  return(
    //return provider with value props
    <AuthContext.Provider value ={value}>
        {!loading && children}
    </AuthContext.Provider>
  )

}