// components/layout/Header.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BellIcon, LogOut, Settings, User as UserIcon } from "lucide-react";

import { useSignalR } from "@/context/SignalRContext";
import { SearchBar } from "@/components/SearchBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAvatarFromLocalStorage } from "@/lib/localStorage";
import { useAuth } from "@/context/AuthContext";
import { useLogoutMutation } from "@/queries/auth.queries";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { NotificationComponent } from "./Notification";

export function Header() {
  const router = useRouter();

  const logoutMutation = useLogoutMutation();
  const { token, logout: authLogout } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [user, setUser] = useState<{ name: string; avatarUrl: string } | null>(
    null
  );
  const { theme, setTheme } = useTheme();

  // Lấy thông tin user từ localStorage khi component mount
  useEffect(() => {
    const username = "PXP";
    const avatar = getAvatarFromLocalStorage();
    if (username && avatar) {
      setUser({
        name: username,
        avatarUrl: `https://cdn.storynest.io.vn/${avatar}`,
      });
    }
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

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 border-b border-white/10 bg-black/0 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex-1 flex justify-center">
        <SearchBar />
      </div>

      {/* Toggle Theme */}
      {/* <Button
        variant="ghost"
        size="icon"
        className="hover:bg-white/10"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-yellow-400 transition-all" />
        ) : (
          <Moon className="h-5 w-5 text-gray-800 transition-all" />
        )}
      </Button> */}

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <NotificationComponent />

        {/* User Avatar */}
        {user && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-white/20 hover:ring-white/40 transition-all">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-black/90 backdrop-blur-xl border-white/10"
            >
              <DropdownMenuLabel className="text-white">
                Tài khoản của tôi
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => router.push("/home/profile")}
                className="hover:bg-white/10 text-white/90"
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Hồ sơ</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 text-white/90">
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => handleLogout()}
                className="hover:bg-white/10 text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
