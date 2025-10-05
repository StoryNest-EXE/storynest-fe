"use client";

import React, { useState } from "react";
import { UserSidebar } from "@/components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SearchBar } from "@/components/SearchBar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebar_open");
      if (saved !== null) {
        setSidebarOpen(saved === "true");
      }
    } catch (err) {
      // ignore localStorage errors
    }
  }, []);

  const handleSidebarOpenChange = React.useCallback((open: boolean) => {
    setSidebarOpen(open);
    try {
      localStorage.setItem("sidebar_open", String(open));
    } catch (err) {
      // ignore localStorage errors
    }
  }, []);

  return (
    <div className="flex ">
      <SidebarProvider
        open={sidebarOpen}
        onOpenChange={handleSidebarOpenChange}
      >
        <UserSidebar />
        <SidebarInset className="">
          {/* Header hoặc đặt trigger ở đây */}
          <header className="sticky top-0 z-50 not-even:flex justify-center h-16 px-4 border-b bg-sidebar  ">
            {/* <h1 className="flex-1 text-center font-semibold">For you</h1> */}
            <SearchBar />
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
