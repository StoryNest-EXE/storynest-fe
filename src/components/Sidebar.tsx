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
import { getPlanIdFromLocalStorage } from "@/lib/localStorage";
import { useEffect, useState } from "react";

const items = [
  { title: "Trang chủ", url: "/", icon: Home },
  { title: "Gói đăng kí", url: "subcription", icon: Inbox },
  { title: "Tạo câu chuyện", url: "/create-story", icon: Plus },
  { title: "Tạo câu chuyện cùng AI", url: "/create-story-ai", icon: Sparkles },
  // { title: "Thông báo", url: "#", icon: Bell },
  { title: "Trang cá nhân", url: "/profile", icon: UserRoundPen },
];

export function UserSidebar() {
  const logoutMutation = useLogoutMutation();
  const { token, logout: authLogout } = useAuth();
  const { state } = useSidebar();
  const [planId, setPlanId] = useState<string | null>(null);

  useEffect(() => {
    setPlanId(getPlanIdFromLocalStorage());
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      authLogout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const filteredItems = items.filter((item) => {
    if (item.title === "Gói đăng kí" && planId !== null) {
      return false;
    }
    return true;
  });

  return (
    <Sidebar
      collapsible="icon"
      className="border-white/10 bg-white/5 backdrop-blur-xl backdrop-saturate-150"
    >
      <SidebarHeader className="flex items-center border-b border-white/10 pb-4">
        {state === "collapsed" ? (
          <SidebarTrigger className="hover:bg-white/10 focus-visible:ring-0 focus-visible:ring-offset-0" />
        ) : (
          <div className="flex flex-row gap-8 items-center">
            <Image
              src="/assets/icon.png"
              alt="Logo lớn"
              width={120}
              height={80}
            />
            <SidebarTrigger className="hover:bg-white/10 focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="flex justify-center">
        <SidebarGroup>
          <SidebarGroupContent>
            <TooltipProvider>
              <SidebarMenu className="gap-10 items-start group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title} className="w-full h-full">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          className="w-full h-full hover:bg-white/10 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <a
                            href={item.url}
                            className="flex items-center gap-2 w-full px-2 py-2 rounded-md justify-start 
                              group-data-[collapsible=icon]:justify-center transition-all duration-200
                              hover:bg-white/10"
                          >
                            <item.icon
                              className="!h-7 !w-7 group-data-[collapsible=icon]:h-7 
                                group-data-[collapsible=icon]:w-7 transition-all
                                !shrink-0 !size-auto text-white/90"
                            />
                            <span className="ml-5 group-data-[collapsible=icon]:hidden text-white/90">
                              {item.title}
                            </span>
                          </a>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="">
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

      <SidebarFooter className="flex items-start group-data-[collapsible=icon]:items-center border-t border-white/10 pt-4">
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
