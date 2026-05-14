import {
  create,
} from 'zustand';

import {
  DEFAULT_USER_PROFILE,
  UserProfile,
  getStoredUserProfile,
  saveStoredUserProfile,
} from '../services/session';

type SessionStore = {
  hydrated: boolean;
  user: UserProfile;
  hydrate: () => Promise<void>;
  updateUser: (
    updates: Pick<
      UserProfile,
      'name' | 'avatarId'
    >
  ) => Promise<void>;
};

export const useSessionStore =
  create<SessionStore>((set, get) => ({

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
