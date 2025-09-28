"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  Inbox,
  Plus,
  Sparkles,
  Search,
  Bell,
  UserRoundPen,
  LogOut,
  LogIn,
  Link,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { useLogoutMutation } from "@/queries/auth.queries";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const items = [
  { title: "Trang chủ", url: "/", icon: Home },
  { title: "Gói đăng kí", url: "subcription", icon: Inbox },
  { title: "Tạo câu chuyện", url: "/create-story", icon: Plus },
  { title: "Tạo câu chuyện cùng AI", url: "/create-story-ai", icon: Sparkles },
  { title: "Tìm kiếm", url: "#", icon: Search },
  { title: "Thông báo", url: "#", icon: Bell },
  { title: "Trang cá nhân", url: "#", icon: UserRoundPen },
];

export function UserSidebar() {
  const logoutMutation = useLogoutMutation();
  const { token, logout: authLogout } = useAuth();
  const { state } = useSidebar();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      authLogout(); // Clear local state
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center">
        {state === "collapsed" ? (
          // <Image src="/svg/logo-2.svg" alt="Logo nhỏ" width={100} height={60} />
          <SidebarTrigger />
        ) : (
          <div className="flex flex-row gap-8">
            <Image
              src="/svg/StoryNest_logo.svg"
              alt="Logo lớn"
              width={120}
              height={80}
            />
            <SidebarTrigger />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="flex justify-center">
        <SidebarGroup>
          <SidebarGroupContent>
            <TooltipProvider>
              <SidebarMenu className="gap-10 items-start group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title} className="w-full">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild className="w-full">
                          <a
                            href={item.url}
                            className="flex items-center gap-2 w-full px-2 py-2 rounded-md justify-start 
                              group-data-[collapsible=icon]:justify-center"
                          >
                            <item.icon
                              className="h-5 w-5 group-data-[collapsible=icon]:h-7 
                                group-data-[collapsible=icon]:w-7 transition-all
                                !shrink-0 !size-auto"
                            />
                            {/* chỉ hiện khi chưa collapsed */}
                            <span className="group-data-[collapsible=icon]:hidden">
                              {item.title}
                            </span>
                          </a>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </TooltipProvider>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex items-start group-data-[collapsible=icon]:items-center">
        {token ? (
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center group-data-[collapsible=icon]:justify-center hover:!bg-red-400"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-5 w-5 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7 transition-all !shrink-0 !size-auto" />
            <span className="group-data-[collapsible=icon]:hidden">
              Log out
            </span>
          </Button>
        ) : (
          <Button
            variant="default"
            className="w-full bg-violet-950 text-white hover:bg-violet-900 flex items-center gap-2 justify-center group-data-[collapsible=icon]:justify-center"
            onClick={() => (window.location.href = "/login")}
          >
            <LogIn className="h-5 w-5 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7 transition-all !shrink-0 !size-auto" />
            <span className="group-data-[collapsible=icon]:hidden">Log in</span>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
