import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getUserScopedKey,
} from './session';

const CONTINUE_KEY =
  'cinebluish_continue';

export async function getContinueWatching() {

  try {

    const key =
      await getUserScopedKey(
        CONTINUE_KEY
      );

    const data =
      await AsyncStorage.getItem(key) ||
      await AsyncStorage.getItem(
        CONTINUE_KEY
      );

    return data ? JSON.parse(data) : [];

  } catch (error) {

    console.log(error);

    return [];
  }
}

export async function saveContinueWatching(
  movie: any
) {

  try {

    const existing =
      await getContinueWatching();

    const filtered =
      existing.filter(
        (item: any) =>
          item.id !== movie.id
      );

    const updated = [
      movie,
      ...filtered,
    ];

    const key =
      await getUserScopedKey(
        CONTINUE_KEY
      );

    await AsyncStorage.setItem(
      key,
      JSON.stringify(updated)
    );

  } catch (error) {
    console.log(error);
  }
}
