import {
  create,
} from 'zustand';

import {
  User,
} from 'firebase/auth';

import {
  DEFAULT_USER_PROFILE,
  UserProfile,
  getStoredUserProfile,
  saveStoredUserProfile,
  syncFirebaseUserProfile,
} from '../services/session';

type SessionStore = {
  authReady: boolean;
  authUser: User | null;
  hydrated: boolean;
  user: UserProfile;
  hydrate: () => Promise<void>;
  setAuthUser: (
    authUser: User | null
  ) => Promise<void>;
  updateUser: (
    updates: Pick<
      UserProfile,
      'name' | 'avatarId'
    >
  ) => Promise<void>;
};

export const useSessionStore =
  create<SessionStore>((set, get) => ({

    authReady: false,

    authUser: null,

    hydrated: false,

    user: DEFAULT_USER_PROFILE,

    hydrate: async () => {

      const profile =
        await getStoredUserProfile();

      set({
        hydrated: true,
        user: profile,
      });
    },

    setAuthUser: async (
      authUser
    ) => {

      if (!authUser) {
        set({
          authReady: true,
          authUser: null,
        });

        return;
      }

      const profile =
        await syncFirebaseUserProfile(
          authUser
        );

      set({
        authReady: true,
        authUser,
        hydrated: true,
        user: profile,
      });
    },

    updateUser: async (
      updates
    ) => {

      const trimmedName =
        updates.name.trim();

      const next: UserProfile = {
        ...get().user,
        name:
          trimmedName ||
          DEFAULT_USER_PROFILE.name,
        avatarId: updates.avatarId,
        updatedAt: Date.now(),
      };

      set({
        user: next,
      });

      await saveStoredUserProfile(next);
    },
  }));
