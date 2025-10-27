"use client";

import { useSignalR } from "@/context/SignalRContext";
import { Notification } from "@/types/notification";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { BellIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";
import { useInfinityNotificationsQuery } from "@/queries/notification.queries";

export function NotificationComponent() {
  const { connection } = useSignalR();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const {
    data: notificationsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityNotificationsQuery(5);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const allNotifications: Notification[] = [
    ...notifications, // new từ SignalR (ưu tiên trên đầu)
    ...(notificationsData?.pages.flatMap((p) => p.data.items) ?? []), // dữ liệu cũ từ API
  ];

  // IntersectionObserver để load thêm khi tới cuối
  useEffect(() => {
    if (!menuOpen) return;
    const timer = setTimeout(() => {
      if (!scrollContainerRef.current || !loadMoreRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
        },
        { root: scrollContainerRef.current, threshold: 0.1 }
      );
      observer.observe(loadMoreRef.current);

      return () => observer.disconnect();
    }, 50); // chờ portal mount

    return () => clearTimeout(timer);
  }, [menuOpen, hasNextPage, fetchNextPage]);

  // Lắng nghe sự kiện SignalR
  useEffect(() => {
    console.log("render NotificationComponent ");
    if (!connection) return;

    const handleReceiveNotification = (newNotification: Notification) => {
      console.log("📩 Received new notification:", newNotification);
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
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

  const handleMarkAllAsRead = useCallback(async () => {
    if (!connection || unreadCount === 0) return;
    try {
      await connection.invoke("MarkAllAsRead");
    } catch (err) {
      console.error("Failed to invoke MarkAllAsRead:", err);
    }
  }, [connection, unreadCount]);

  return (
    <div>
      <DropdownMenu
        modal={false}
        onOpenChange={(open) => {
          setMenuOpen(open);
          if (open) handleMarkAllAsRead();
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-white/10"
          >
            <BellIcon className="h-5 w-5 text-white/90" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          ref={scrollContainerRef}
          className="w-80 max-h-[400px] overflow-y-auto bg-black/90 backdrop-blur-xl border-white/10"
        >
          <DropdownMenuLabel className="text-white">
            Thông báo
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          {allNotifications.length > 0 ? (
            <>
              {allNotifications.map((noti) => (
                <DropdownMenuItem
                  key={noti.id}
                  // onClick={() =>
                  //   router.push(`/detail-story/${noti.referenceId}`)
                  // }
                  className="flex items-start gap-2 hover:bg-white/10"
                >
                  {!noti.isRead && (
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-sky-500 shrink-0" />
                  )}
                  <span
                    className={
                      noti.isRead ? "text-white/60" : "font-semibold text-white"
                    }
                  >
                    <div className="flex flex-row gap-2">
                      <Avatar className="h-9 w-9 cursor-pointer">
                        <AvatarImage
                          src={noti.actor?.avatarUrl}
                          alt={noti.actor?.username}
                        />
                        <AvatarFallback>
                          {noti.actor?.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p dangerouslySetInnerHTML={{ __html: noti.content }}></p>
                    </div>
                  </span>
                </DropdownMenuItem>
              ))}

              {isFetchingNextPage && (
                <p className="p-2 text-center text-sm text-white/60">
                  Đang tải thêm...
                </p>
              )}

              <div ref={loadMoreRef} />
            </>
          ) : (
            <p className="p-4 text-sm text-center text-white/60">
              Không có thông báo mới.
            </p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
