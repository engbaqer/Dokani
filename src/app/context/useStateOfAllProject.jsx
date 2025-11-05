"use client"; // if using app/router

import { createContext, useContext, useState } from "react";

const useStateOfAllProjectContext = createContext();

export function UseStateOfAllProjectProvider({ children }) {
    const [ImgUrl, setImgUrl] = useState("");
    const [NameOfStore, setNameOfStore] = useState("");
  

    return (
        <useStateOfAllProjectContext.Provider
            value={{
                ImgUrl, setImgUrl,
                NameOfStore, setNameOfStore
              
            }}
        >
            {children}
        </useStateOfAllProjectContext.Provider>
    );
}

// Custom hook to access the global state
export function useStateOfAllProject() {
    return useContext(useStateOfAllProjectContext);
}
