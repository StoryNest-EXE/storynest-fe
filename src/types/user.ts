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
