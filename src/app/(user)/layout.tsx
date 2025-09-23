import RequireRole from "@/auth/RequireRole";
import React from "react";

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <RequireRole role="user">
        <main className="flex-1 p-6">{children}</main>
      </RequireRole>
    </div>
  );
}

export default UserLayout;
