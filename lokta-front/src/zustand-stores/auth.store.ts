import { LoginResponse } from "@/api/services/auth/types";
import { BaseUser } from "@/api/services/user/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthStore = {
  isAuthenticated: boolean;
  accessToken: string;
  user: BaseUser | null;
  login: (res: LoginResponse) => void;
  logout: () => void;
  updateProfile: (user: BaseUser) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: "",
      user: null,
      login: (res: LoginResponse) =>
        set({
          isAuthenticated: true,
          accessToken: res.access_token,
          user: res.user,
        }),
      logout: () => set({ isAuthenticated: false, accessToken: "" }),
      updateProfile: (user: BaseUser) =>
        set((state) => ({ user: { ...state.user, ...user } })),
    }),
    { name: "auth-storage", storage: createJSONStorage(() => localStorage) }
  )
);
