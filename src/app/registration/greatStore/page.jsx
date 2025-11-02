"use client"
import { GlobalStateProvider } from "../context/GlobalState";
// import RegistrationForm from "./registrationForm";
import GreatStore from "./greatStore";

export default function Registration() {
    return (
        <GlobalStateProvider>
            <div className="h-screen flex items-center justify-center p-8" dir="rtl">
                {/* <RegistrationForm /> */}
                <GreatStore/>
            </div>
        </GlobalStateProvider>
    );
}