import { getMe } from "@/services/user.service";
import { UserProfileResponse } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useMeQuery = () => {
  return useQuery<UserProfileResponse>({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });
};
