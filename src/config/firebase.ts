import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getApps,
  initializeApp,
} from 'firebase/app';

import * as FirebaseAuth from 'firebase/auth';

  import {
  getFirestore,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB7vVY82-jyYK6qmFaGiDcVVRHsh-vDc2o',

  authDomain: "cinebluish.firebaseapp.com",

  projectId: "cinebluish",

  storageBucket: "cinebluish.firebasestorage.app",

  messagingSenderId:
    "490985825755",

  appId: "1:490985825755:web:0f28a42d83b8f4520033fe",
};

export const app =
  getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig);

export const auth =
  (() => {

    const authModule =
      FirebaseAuth as typeof FirebaseAuth & {
        getReactNativePersistence?: (
          storage: typeof AsyncStorage
        ) => any;
      };

    try {

      return authModule.initializeAuth(app, {
        persistence:
          authModule.getReactNativePersistence?.(
            AsyncStorage
          ) ||
          authModule.inMemoryPersistence,
      });

    } catch {
      return authModule.getAuth(app);
    }
  })();

export const db =
  getFirestore(app);