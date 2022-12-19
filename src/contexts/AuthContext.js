import React, { useContext, useEffect, useState } from "react";
import "../firebase";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged} from 'firebase/auth';

const AuthContext = React.createContext();
export function useAuth() {
    return useContext(AuthContext);
}
export function AuthProvider({children}) {
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState();

    useEffect(() =>{
        const auth = getAuth();
           const unsubscribe = onAuthStateChanged(auth, (user) =>{
            setCurrentUser(user);
            setLoading(false)
        })
        return unsubscribe;
    }, [])

    //Sign up function
    async function signup(email, password, username) {
        const auth =getAuth();
        await createUserWithEmailAndPassword(auth,email,password);


        //update profile
        await updateProfile(auth.currentUser, {displayName: username});

        const user =auth.currentUser
        setCurrentUser({
            ...user,
        })
    }

    //Log in Function
    function login(email, password) {
        const auth = getAuth();
        return signInWithEmailAndPassword(auth, email, password)
    }

    //Log out Function
    function logout() {
        const auth = getAuth();
        return signOut(auth);
    }
    const value ={
        currentUser,
        signup,
        login,
        logout
    }
    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider> 
    );
}