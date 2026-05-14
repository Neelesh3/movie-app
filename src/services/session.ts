import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProfile = {
  id: string;
  name: string;
  avatarId: number;
  createdAt: number;
  updatedAt: number;
};

export const PROFILE_AVATARS = [
  {
    id: 12,
    uri: 'https://i.pravatar.cc/300?img=12',
  },
  {
    id: 32,
    uri: 'https://i.pravatar.cc/300?img=32',
  },
  {
    id: 47,
    uri: 'https://i.pravatar.cc/300?img=47',
  },
  {
    id: 56,
    uri: 'https://i.pravatar.cc/300?img=56',
  },
  {
    id: 68,
    uri: 'https://i.pravatar.cc/300?img=68',
  },
];

const USER_PROFILE_KEY =
  'cinebluish_active_profile';

export const DEFAULT_USER_PROFILE:
  UserProfile = {
    id: 'local-cinephile',
    name: 'Neelesh',
    avatarId: 12,
    createdAt: 0,
    updatedAt: 0,
  };

export function getProfileNameFromEmail(
  email?: string | null
) {

  if (!email) {
    return DEFAULT_USER_PROFILE.name;
  }

  return email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
    .trim() ||
    DEFAULT_USER_PROFILE.name;
}

function withTimestamp(
  profile: UserProfile
): UserProfile {

  const now =
    Date.now();

  return {
    ...profile,
    createdAt:
      profile.createdAt || now,
    updatedAt:
      profile.updatedAt || now,
  };
}

export function getAvatarUri(
  avatarId: number
) {

  return PROFILE_AVATARS.find(
    (avatar) =>
      avatar.id === avatarId
  )?.uri || PROFILE_AVATARS[0].uri;
}

export function getFirstName(
  name: string
) {

  return name.trim()
    .split(/\s+/)[0] ||
    'Cinephile';
}

export async function getStoredUserProfile():
  Promise<UserProfile> {

  try {

    const data =
      await AsyncStorage.getItem(
        USER_PROFILE_KEY
      );

    if (!data) {
      const profile =
        withTimestamp(
          DEFAULT_USER_PROFILE
        );

      await saveStoredUserProfile(
        profile
      );

      return profile;
    }

    const parsed =
      JSON.parse(data);

    return withTimestamp({
      ...DEFAULT_USER_PROFILE,
      ...parsed,
      name:
        typeof parsed?.name ===
        'string'
          ? parsed.name
          : DEFAULT_USER_PROFILE.name,
      avatarId:
        typeof parsed?.avatarId ===
        'number'
          ? parsed.avatarId
          : DEFAULT_USER_PROFILE.avatarId,
      id:
        typeof parsed?.id ===
        'string'
          ? parsed.id
          : DEFAULT_USER_PROFILE.id,
    });

  } catch (error) {

    console.log(error);

    return withTimestamp(
      DEFAULT_USER_PROFILE
    );
  }
}

export async function saveStoredUserProfile(
  profile: UserProfile
) {

  try {

    await AsyncStorage.setItem(
      USER_PROFILE_KEY,
      JSON.stringify(
        withTimestamp(profile)
      )
    );

  } catch (error) {
    console.log(error);
  }
}

export async function syncFirebaseUserProfile(
  firebaseUser: {
    displayName?: string | null;
    email?: string | null;
    uid: string;
  }
) {

  const existing =
    await getStoredUserProfile();

  const isSameUser =
    existing.id === firebaseUser.uid;

  const next: UserProfile = {
    ...existing,
    id: firebaseUser.uid,
    name:
      isSameUser
        ? existing.name
        : firebaseUser.displayName ||
          getProfileNameFromEmail(
            firebaseUser.email
          ),
    avatarId:
      isSameUser
        ? existing.avatarId
        : DEFAULT_USER_PROFILE.avatarId,
    updatedAt: Date.now(),
  };

  await saveStoredUserProfile(next);

  return next;
}

export async function getActiveUserId() {

  const profile =
    await getStoredUserProfile();

  return profile.id;
}

export async function getUserScopedKey(
  baseKey: string
) {

  const userId =
    await getActiveUserId();

  return `${baseKey}:${userId}`;
}
