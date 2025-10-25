"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Inbox,
  Plus,
  Sparkles,
  UserRoundPen,
  LogOut,
  LogIn,
  ChevronLeft,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Trang chủ", href: "/", icon: Home },
  { title: "Gói đăng ký", href: "/subscription", icon: Inbox },
  { title: "Tạo câu chuyện", href: "/create-story", icon: Plus },
  { title: "Tạo câu chuyện cùng AI", href: "/create-story-ai", icon: Sparkles },
  { title: "Trang cá nhân", href: "/profile", icon: UserRoundPen },
];

export default function UserSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true); // giả lập trạng thái đăng nhập

  return (
    <TooltipProvider>
      <aside
        className={`h-screen flex flex-col justify-between transition-all duration-300 border-r 
        ${collapsed ? "w-[90px]" : "w-[240px]"} 
        bg-gradient-to-b from-[#1E1E1E]/90 to-[#111]/90 backdrop-blur-md text-white`}
      >
        {/* Header */}
        <div
          className={`flex items-center ${
            collapsed ? "justify-center py-6" : "justify-between px-4 py-6"
          } border-b border-white/10 transition-all duration-300`}
        >
          {!collapsed && (
            <div className="flex flex-col items-center justify-center w-full">
              <Image
                src="/assets/icon.png"
                alt="Logo"
                width={100}
                height={45}
                className="mx-auto mb-2"
              />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-white/10 transition"
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${
                collapsed ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>

        {/* Menu */}
        <div className=" flex flex-col">
          <nav
            className={`flex flex-col items-stretch overflow-y-auto scrollbar-none transition-all duration-300 gap-10
            ${
              collapsed
                ? "justify-start space-y-2 py-6 px-3"
                : "justify-center space-y-5 px-4 py-8"
            }
          `}
          >
            {menuItems.map((item) => (
              <Tooltip key={item.title} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-all
                      ${collapsed ? "justify-center gap-0" : "gap-4"}
                    `}
                  >
                    <item.icon
                      className={`shrink-0 text-white/90 transition-all duration-300 
                            ${collapsed ? "w-8 h-8" : "w-6 h-6"}
                        `}
                    />
                    {!collapsed && (
                      <span className="truncate text-white/90 font-medium">
                        {item.title}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          {loggedIn ? (
            <Button
              variant="outline"
              className={`w-full flex items-center gap-2 justify-center hover:bg-red-500/80 
                ${collapsed ? "justify-center" : ""}
              `}
              onClick={() => setLoggedIn(false)}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span>Log out</span>}
            </Button>
          ) : (
            <Button
              className={`w-full bg-violet-700 hover:bg-violet-600 flex items-center gap-2 justify-center 
                ${collapsed ? "justify-center" : ""}
              `}
              onClick={() => setLoggedIn(true)}
            >
              <LogIn className="w-5 h-5" />
              {!collapsed && <span>Log in</span>}
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
