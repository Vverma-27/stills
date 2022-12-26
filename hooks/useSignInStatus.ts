// The useColorScheme value is always either light or dark, but the built-in
// type suggests that it can be null. This will not happen in practice, so this

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onIdTokenChanged } from "firebase/auth/react-native";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { IAppState, useAppDispatch } from "../redux";
import { setError, setFirstLoad, setUser, updateUser } from "../redux/auth";
import app, { auth } from "../services/firebase";
import { getUserData } from "../utils/api";

// makes it a bit easier to work with.
export default function useSignInStatus() {
  const dispatch = useAppDispatch();
  const { firstLoad, currentUser: actualUser } = useSelector(
    (state: IAppState) => state.auth
  );
  useEffect(() => {
    const idUnsubscribe = onIdTokenChanged(auth, async (user) => {
      // console.log(
      //   "🚀 ~ file: useSignInStatus.ts ~ line 22 ~ idUnsubscribe ~ user",
      //   user
      // );
      if (user && actualUser && actualUser.email !== user.email) {
        console.log(
          "🚀 ~ file: useSignInStatus.ts:27 ~ idUnsubscribe ~ user.email",
          user.email
        );
        dispatch(updateUser({ email: user.email }));
      }
      // return console.log(user);
    });
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // console.log(
      //   "🚀 ~ file: useSignInStatus.ts ~ line 20 ~ unsubscribe ~ firstLoad",
      //   user?.emailVerified
      // );
      if (firstLoad) return;
      if (user) {
        if (user.emailVerified || (user.phoneNumber && !user.email)) {
          const actualUser = await getUserData(user.uid);
          console.log(
            "🚀 ~ file: useSignInStatus.ts ~ line 26 ~ onAuthStateChanged ~ actualUser",
            actualUser
          );
          dispatch(setUser(actualUser));
        }
        dispatch(setFirstLoad());
      } else {
        dispatch(setFirstLoad());
      }
    });
    return () => {
      unsubscribe();
      idUnsubscribe();
    };
    // console.log(user);
    // });
  }, [firstLoad]);
}
