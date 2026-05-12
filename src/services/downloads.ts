import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  safeArray,
} from '../api/request';

export const DOWNLOADS_KEY =
  'cinebluish_downloads';

export async function getStoredDownloads() {

  try {

    const data =
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

    await AsyncStorage.setItem(
      DOWNLOADS_KEY,
      JSON.stringify(
        safeArray(downloads)
      )
    );

  } catch (error) {

    console.log(error);
  }
}
