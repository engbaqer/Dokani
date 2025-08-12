"use client"; // if using app/ router

import { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext();

export function GlobalStateProvider({ children }) {
    const [userName, setUserName] = useState(""); // default Arabic value
    const [email, setEmail] = useState(""); // default Arabic value
    const [password, setPassword] = useState(""); // default Arabic value

    return (
        <GlobalStateContext.Provider value={{ userName, setUserName ,email , setEmail , password , setPassword }}>
            {children}
        </GlobalStateContext.Provider>
    );
}

// Custom hook to access state
export  function useGlobalState() {
    return useContext(GlobalStateContext);
}