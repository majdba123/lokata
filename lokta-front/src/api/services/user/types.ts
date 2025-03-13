export type BaseUser = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type UpdateProfileRequest = {
  name?: string;
};

export type UpdateProfileResponse = {
  message: string;
  data: BaseUser & { role: string };
};
