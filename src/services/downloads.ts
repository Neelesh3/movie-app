import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  safeArray,
} from '../api/request';

import {
  getUserScopedKey,
} from './session';

export const DOWNLOADS_KEY =
  'cinebluish_downloads';

export async function getStoredDownloads() {

  try {

    const key =
      await getUserScopedKey(
        DOWNLOADS_KEY
      );

    const data =
      await AsyncStorage.getItem(key) ||
      await AsyncStorage.getItem(
        DOWNLOADS_KEY
      );

    return data
      ? safeArray(JSON.parse(data))
      : [];

  } catch (error) {

    console.log(error);

    return [];
  }
}

export async function saveStoredDownloads(
  downloads: any[]
) {

  try {

    const key =
      await getUserScopedKey(
        DOWNLOADS_KEY
      );

    await AsyncStorage.setItem(
      key,
      JSON.stringify(
        safeArray(downloads)
      )
    );

  } catch (error) {

    console.log(error);
  }
}
