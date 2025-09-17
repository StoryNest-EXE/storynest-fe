import { UserSidebar } from "@/components/Sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SidebarProvider>
        <UserSidebar />
        <SidebarInset>
          {/* Header hoặc đặt trigger ở đây */}
          <header className="flex items-center h-16 px-4 border-b">
            <SidebarTrigger />
            <h1 className="ml-4 font-semibold">My App</h1>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
