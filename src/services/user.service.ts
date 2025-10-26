import https from "@/lib/axios";
import { UpdateUserProfileRequest } from "@/types/user";

export const getMe = async () => {
  const response = await https.get("/api/User/me");
  return response.data;
};

export const putMe = async (data: UpdateUserProfileRequest) => {
  const response = await https.put("/api/User/update", data);
  return response.data;
};
