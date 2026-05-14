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
syncContinueWatchingToCloud(
  items: any[]
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
        'continueWatching',
        user.uid
      ),

      {
        items,
      }
    );

  } catch (error) {

    console.log(error);
  }
}

export async function
getCloudContinueWatching() {

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
          'continueWatching',
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
