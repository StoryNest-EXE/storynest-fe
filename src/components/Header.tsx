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
import { Notification } from "@/types/notification";
import { useLogoutMutation } from "@/queries/auth.queries";

export function Header() {
  const router = useRouter();
  const { connection } = useSignalR();
  const logoutMutation = useLogoutMutation();
  const { token, logout: authLogout } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<{ name: string; avatarUrl: string } | null>(
    null
  );

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

  // Fetch thông báo ban đầu từ API
  useEffect(() => {
    const fetchInitialNotifications = async () => {
      try {
        // --- TODO: Thay thế bằng API thật của bạn ---
        // const response = await fetch("/api/notifications");
        // const data: Notification[] = await response.json();

        // Dữ liệu giả để demo
        const data: Notification[] = [];

        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchInitialNotifications();
  }, []);

  // Lắng nghe sự kiện SignalR
  useEffect(() => {
    if (!connection) return;

    const handleReceiveNotification = (newNotification: Notification) => {
      console.log("📩 Received new notification:", newNotification);
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      // Có thể hiện một toast/popup ở đây
    };

    const handleNotificationsMarkedAsRead = () => {
      console.log("✅ All notifications marked as read from server.");
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    connection.on("ReceiveNotification", handleReceiveNotification);
    connection.on("NotificationsMarkedAsRead", handleNotificationsMarkedAsRead);

    return () => {
      connection.off("ReceiveNotification", handleReceiveNotification);
      connection.off(
        "NotificationsMarkedAsRead",
        handleNotificationsMarkedAsRead
      );
    };
  }, [connection]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      authLogout(); // Clear local state
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Hàm đánh dấu tất cả là đã đọc
  const handleMarkAllAsRead = useCallback(async () => {
    if (!connection || unreadCount === 0) return;
    try {
      await connection.invoke("MarkAllAsRead");
    } catch (err) {
      console.error("Failed to invoke MarkAllAsRead:", err);
    }
  }, [connection, unreadCount]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 border-b bg-background">
      <div className="flex-1 flex justify-center">
        <SearchBar />
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <DropdownMenu
          onOpenChange={(open) => {
            // Khi mở dropdown, gọi hàm đánh dấu đã đọc
            if (open) handleMarkAllAsRead();
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((noti) => (
                <DropdownMenuItem
                  key={noti.id}
                  onClick={() =>
                    router.push(`/detail-story/${noti.referenceId}`)
                  }
                  className="flex items-start gap-2"
                >
                  {!noti.isRead && (
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-sky-500 shrink-0" />
                  )}
                  <span
                    className={
                      noti.isRead ? "text-muted-foreground" : "font-semibold"
                    }
                  >
                    {/* {noti.content} */}
                    <div className="flex flex-row gap-2">
                      <Avatar className="h-9 w-9 cursor-pointer">
                        <AvatarImage
                          src={noti.actor.avatarUrl}
                          alt={noti.actor.username}
                        />
                        <AvatarFallback>
                          {noti.actor.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p dangerouslySetInnerHTML={{ __html: noti.content }}></p>
                    </div>
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <p className="p-4 text-sm text-center text-muted-foreground">
                Không có thông báo mới.
              </p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Hồ sơ</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleLogout()}>
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
