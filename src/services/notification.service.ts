import https from "@/lib/axios";
import { NotificationResponse } from "@/types/notification";

export const getNotifications = async (limit: number, cursor?: string) => {
  const response = await https.get<NotificationResponse>(
    "/api/Notification/all",
    {
      params: { limit, cursor },
    }
  );
  return response.data;
};
