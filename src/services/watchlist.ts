import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_KEY = 'cinebluish_watchlist';

export async function getWatchlist() {

  try {

    const data =
      await AsyncStorage.getItem(
        WATCHLIST_KEY
      );

    return data ? JSON.parse(data) : [];

  } catch (error) {

    console.log(error);

    return [];
  }
}

export async function addToWatchlist(
  movie: any
) {

  try {

    const existing =
      await getWatchlist();

    const alreadyExists =
      existing.find(
        (item: any) =>
          item.id === movie.id
      );

    if (alreadyExists) {
      return;
    }

    const updated = [
      ...existing,
      movie,
    ];

    await AsyncStorage.setItem(
      WATCHLIST_KEY,
      JSON.stringify(updated)
    );

  } catch (error) {
    console.log(error);
  }
}

export async function removeFromWatchlist(
  movieId: number
) {

  try {

    const existing =
      await getWatchlist();

    const updated =
      existing.filter(
        (item: any) =>
          item.id !== movieId
      );

    await AsyncStorage.setItem(
      WATCHLIST_KEY,
      JSON.stringify(updated)
    );

  } catch (error) {
    console.log(error);
  }
}