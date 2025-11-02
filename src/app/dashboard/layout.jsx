"use client";

import { DashboardStateProvider } from "./StateMangOfDashboard/context";

export default function DashboardLayout({ children }) {
  return (
    <DashboardStateProvider>
      <section className="min-h-screen w-full bg-gray-50 p-6">
        {children}
      </section>
    </DashboardStateProvider>
  );
}