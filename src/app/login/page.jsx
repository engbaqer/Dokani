"use client"
import { GlobalStateProvider } from "../registration/context/GlobalState";
import LoginForm from "./loginForm";

export default function login() {
    return (
        <GlobalStateProvider>
            <div className="h-screen flex items-center justify-center p-8" dir="rtl">
               <LoginForm /> 
            </div>
        </GlobalStateProvider>
    );
}
