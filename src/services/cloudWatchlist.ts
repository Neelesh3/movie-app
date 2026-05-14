import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

import {
  db,
  auth,
} from '../config/firebase';

export async function
syncWatchlistToCloud(
  watchlist: any[]
) {

  try {

    const user =
      auth.currentUser;

    if (!user) {
      return;
    }

    await setDoc(

      doc(
        db,
        'watchlists',
        user.uid
      ),

      {
        items: watchlist,
      }
    );

  } catch (error) {

    console.log(error);
  }
}

export async function
getCloudWatchlist() {

  try {

    const user =
      auth.currentUser;

    if (!user) {
      return [];
    }

    const snapshot =
      await getDoc(

        doc(
          db,
          'watchlists',
          user.uid
        )
      );

    if (!snapshot.exists()) {
      return [];
    }

    return (
      snapshot.data()
        ?.items || []
    );

  } catch (error) {

    console.log(error);

    return [];
  }
}