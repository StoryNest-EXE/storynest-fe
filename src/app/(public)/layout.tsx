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
        <SidebarInset className="">
          {/* Header hoặc đặt trigger ở đây */}
          <header className="sticky top-0 z-50 not-even:flex items-center h-16 px-4 border-b bg-neutral-950">
            <SidebarTrigger />
            <h1 className="flex-1 text-center font-semibold">For you</h1>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
