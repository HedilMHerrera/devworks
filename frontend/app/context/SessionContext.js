import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useSessionZ = create()(
  persist(
    (set) => ({
      token: null,
      user: null,
      rol: null,
      setSession: (dataToken, dataUser) => set({ token:dataToken, user:dataUser, rol:dataUser.rol }),
      logout: () => set({ token:null, user:null, rol:null }),
      name: "data-user-session",
      storage: createJSONStorage(() => cookieStore),
    }),
  ),
);
