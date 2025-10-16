import https from "@/lib/axios";

export const getMe = async () => {
  const response = await https.get("/api/User/me");
  return response.data;
};
