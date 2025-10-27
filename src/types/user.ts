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

//------------------------------------------------------ CHANGE PASSWORD ------------------------------------------------------
export const changePasswordFormSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
    newPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"], // Đặt lỗi vào trường confirmPassword
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

export const ChangePasswordRequest = z.object({});
