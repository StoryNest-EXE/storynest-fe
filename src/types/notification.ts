export interface Actor {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface User {
  id: number;
  username: string;
  avatarUrl: string;
}

export type ReferenceType = "story" | "comment" | "other"; // bạn có thể mở rộng sau

export interface Notification {
  id: number;
  userId: number;
  user: User;
  actor: Actor;
  referenceId: number;
  referenceType: ReferenceType;
  type: number; // có thể đổi sang enum nếu bạn có định nghĩa rõ ràng
  content: string;
  createdAt: string; // ISO datetime string
  isRead: boolean;
}

export interface NotificationResponse {
  status: number;
  message: string;
  data: NotificationData;
}

export interface NotificationData {
  nextCursor: string | null;
  hasMore: boolean;
  items: Notification[];
}
