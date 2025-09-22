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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { useLogoutQuery } from "@/queries/auth.queries";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Create Story", url: "/create-story", icon: Plus },
  { title: "Create Story with AI", url: "#", icon: Sparkles },
  { title: "Search", url: "#", icon: Search },
  { title: "Notifications", url: "#", icon: Bell },
  { title: "Profile", url: "#", icon: UserRoundPen },
];

export function UserSidebar() {
  const logout = useLogoutQuery();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>Header</SidebarHeader>
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
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-center group-data-[collapsible=icon]:justify-center hover:!bg-red-400"
        >
          <LogOut className="h-5 w-5 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7 transition-all !shrink-0 !size-auto" />
          <span className="group-data-[collapsible=icon]:hidden">Log out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
