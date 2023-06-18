import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCZj87OvKPkJcWF6zkyQQy5efy3sj6Cfh4",
  authDomain: "countdown-timer-firebase.firebaseapp.com",
  projectId: "countdown-timer-firebase",
  storageBucket: "countdown-timer-firebase.appspot.com",
  messagingSenderId: "109300325711",
  appId: "1:109300325711:web:a66a426b13926deff0793a",
  databaseURL: "https://countdown-timer-firebase-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);

const dbFirestore = getFirestore(app);
const dbRtdb = getDatabase(app);

export { dbFirestore, dbRtdb };
