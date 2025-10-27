import { getMe, putMe } from "@/services/user.service";
import { UpdateUserProfileRequest, UserProfileResponse } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useMeQuery = () => {
  return useQuery<UserProfileResponse>({
    queryKey: ["me"],
    queryFn: () => getMe(),
  });
};

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: (data: UpdateUserProfileRequest) => putMe(data),
  });
};
