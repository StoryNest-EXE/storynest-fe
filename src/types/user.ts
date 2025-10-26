import z from "zod";

export const profileFormSchema = z.object({
  userName: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 kí tự"),
  fullName: z.string().nullable().optional(),
  bio: z
    .string()
    .max(200, "Tiểu sử không được quá 200 ký tự")
    .nullable()
    .optional(),
  dateOfBirth: z.date().refine((val) => val, {
    message: "Vui lòng chọn ngày sinh",
  }),
  gender: z.enum(["male", "female", "other"]).refine((val) => val, {
    message: "Vui lòng chọn giới tính",
  }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export interface UserProfileResponse {
  status: number;
  message: string;
  data: UserProfile;
}

export interface UserProfile {
  email: string;
  fullName: string | null;
  bio: string | null;
  coverUrl: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  createdAt: string;
  followersCount: number;
  id: number;
  username: string;
  avatarUrl: string | null;
}

// Update Profile
export interface UpdateUserProfileRequest {
  userName: string;
  fullName: string;
  bio: string;
  dateOfBirth: Date;
  gender: string;
}
