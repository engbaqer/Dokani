  "use client"
  import { createContext, useContext as useReactContext, useState } from "react";

// 1. Create the context
const DashboardStateContext = createContext();

// 2. Provider component to wrap your app
export function DashboardStateProvider({ children }) {
  const [showTheForm, setShowTheForm] = useState(""); // state for form visibility
  const [showTheFormOFupdate, setShowTheFormOFupdate] = useState(""); // state for form visibility

  const [ProductIdForEditing, setProductIdForEditing] = useState("");
  return (
    <DashboardStateContext.Provider value={{ showTheForm, setShowTheForm, showTheFormOFupdate, setShowTheFormOFupdate , ProductIdForEditing , setProductIdForEditing }}>
      {children}
    </DashboardStateContext.Provider>
  );
}

// 3. Custom hook to access state
export function useDashboardState() {
  return useReactContext(DashboardStateContext);
}
