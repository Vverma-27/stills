// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getDatabase } from "firebase/database";
import {
  browserLocalPersistence,
  getAuth,
  initializeAuth,
} from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Provide it to initializeAuth.

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyC1tNS-s2Nv6SN_w1zv1xjlzIEFyCrhB4w",
  authDomain: "stills-4e5a6.firebaseapp.com",
  projectId: "stills-4e5a6",
  storageBucket: "stills-4e5a6.appspot.com",
  messagingSenderId: "690097487360",
  appId: "1:690097487360:web:0c212c3d52086acdc122e5",
  measurementId: "G-JL0X0MS4GH",
  databaseURL:
    "https://stills-4e5a6-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
export const database = getDatabase(app);
// export const auth = getAuth();
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
  // persistence: browserLocalPersistence,
});
// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider("abcdefghijklmnopqrstuvwxy-1234567890abcd"),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true,
// });
// console.log(appCheck);
// const analytics = getAnalytics(app);
// console.log(analytics);
