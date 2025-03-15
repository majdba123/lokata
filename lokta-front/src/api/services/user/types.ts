export type BaseUser = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  image: string | null;
  is_vendor : boolean
};

export type UpdateProfileRequest = {
  name?: string;
  image?: string;
};

export type UpdateProfileResponse = {
  message: string;
  data: BaseUser & { role: string };
};
