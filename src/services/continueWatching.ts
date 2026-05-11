import AsyncStorage from '@react-native-async-storage/async-storage';

const CONTINUE_KEY =
  'cinebluish_continue';

export async function getContinueWatching() {

  try {

    const data =
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

    await AsyncStorage.setItem(
      CONTINUE_KEY,
      JSON.stringify(updated)
    );

  } catch (error) {
    console.log(error);
  }
}