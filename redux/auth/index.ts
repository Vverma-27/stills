import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  PhoneAuthProvider,
  sendEmailVerification,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { child, get, getDatabase, onValue, ref, set } from "firebase/database";
import { auth, database } from "../../services/firebase";
import { IAuthReducer, IUser } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getUserData,
  phoneNumberExists,
  setUserData,
  updateUserData,
} from "../../utils/api";
import { IAppState } from "..";
const initialState: IAuthReducer = {
  // name: "Vihaan",
  currentUser: null,
  loading: false,
  error: "",
  success: "",
  firstLoad: false,
};

export const logOutUser = createAsyncThunk(
  "auth/logOutUser",
  async (h: string = "", { rejectWithValue }) => {
    try {
      await auth.signOut();
    } catch (error: any) {
      console.log(error);
      const errorCode = error.code;
      const errorMessage = error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const signUpUser = createAsyncThunk(
  "auth/signUpUser",
  async (userData: IUser & { password: string }, { rejectWithValue }) => {
    console.log("🚀 ~ file: index.ts ~ line 40 ~ userData", userData);
    try {
      if (!userData.email || !userData.password)
        return rejectWithValue(
          "The registration couldn't be completed. Please try again."
        );
      const { user } = await createUserWithEmailAndPassword(
        auth,
        userData.email.trim(),
        userData.password
      );
      console.log("🚀 ~ file: index.ts ~ line 55 ~ user", user);
      const {
        email,
        phoneNumber = null,
        photoURL = "",
        uid,
        displayName = "",
      } = user;
      sendEmailVerification(user);
      return setUserData({
        name: userData.name,
        email,
        phoneNumber,
        profile_picture: photoURL,
        uid,
        username: userData.username || displayName,
        age: userData.age,
        dob: userData.dob,
        providerType: "email",
      });
    } catch (error: any) {
      console.log(error);
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == "auth/weak-password") {
        return rejectWithValue("The password is too weak.");
      } else if (errorCode == "auth/invalid-email") {
        return rejectWithValue("The email address is invalid.");
      } else if (errorCode == "auth/email-already-in-use") {
        return rejectWithValue(
          "The email address is already in use by another account."
        );
      } else {
        return rejectWithValue(errorMessage);
      }
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData: Partial<IUser>, { rejectWithValue, getState }) => {
    console.log("🚀 ~ file: index.ts ~ line 40 ~ userData", userData);
    const state: any = getState();
    try {
      const user = await updateUserData({
        uid: state.auth.currentUser.uid,
        ...userData,
      });
      console.log("🚀 ~ file: index.ts ~ line 100 ~ user", user);
      return user;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    userData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    console.log(userData.email);
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        userData.email.trim(),
        userData.password
      );
      // console.log(user);
      // console.log(
      //   "🚀 ~ file: index.ts ~ line 77 ~ user",
      //   user.stsTokenManager.expirationTime
      // );
      if (!user.emailVerified)
        return rejectWithValue("Kindly Verify Your Email First");
      //@ts-ignore
      const actualUser: IUser = await getUserData(user.uid);
      if (!actualUser) return rejectWithValue("No User Found!");
      console.log("🚀 ~ file: index.ts ~ line 86 ~ actualUser", actualUser);
      // console.log(actualUser);
      return { user: actualUser };
    } catch (error: any) {
      console.log(error);
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == "auth/wrong-password") {
        return rejectWithValue("Invalid Credentials");
      } else if (errorCode == "auth/invalid-email") {
        return rejectWithValue("Invalid Credentials");
      } else if (errorCode == "auth/user-not-found") {
        return rejectWithValue("Invalid Credentials");
      } else {
        return rejectWithValue(errorMessage);
      }
    }
  }
);

export const signupUserPhone = createAsyncThunk(
  "auth/signupUserPhone",
  async (userData: IUser, { rejectWithValue }) => {
    try {
      const actualUser = await setUserData({
        ...userData,
        providerType: "phone",
      });
      console.log("🚀 ~ file: index.ts ~ line 145 ~ user", actualUser);
      return { user: actualUser };
      // console.log(actualUser);
      // return { user: actualUser };
    } catch (error: any) {
      console.log(error);
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == "auth/code-expired") {
        return rejectWithValue("Code has expired. Request a new one.");
      } else if (errorCode == "auth/invalid-verification-code") {
        return rejectWithValue("Invalid code.");
      } else if (errorCode == "auth/user-not-found") {
        return rejectWithValue("Invalid Credentials");
      } else {
        return rejectWithValue(errorMessage);
      }
    }
  }
);

export const loginUserPhone = createAsyncThunk(
  "auth/loginUserPhone",
  async (uid: string, { rejectWithValue }) => {
    try {
      //@ts-ignore
      const actualUser: IUser = await getUserData(uid);
      if (!actualUser) return rejectWithValue("No User Found!");
      return { user: actualUser };
      // console.log(actualUser);
      // return { user: actualUser };
    } catch (error: any) {
      console.log(error);
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == "auth/code-expired") {
        return rejectWithValue("Code has expired. Request a new one.");
      } else if (errorCode == "auth/invalid-verification-code") {
        return rejectWithValue("Invalid code.");
      } else if (errorCode == "auth/user-not-found") {
        return rejectWithValue("Invalid Credentials");
      } else {
        return rejectWithValue(errorMessage);
      }
    }
  }
);

const authSlice: any = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
      state.success = "";
      state.loading = false;
    },
    setSuccess: (state, action) => {
      state.error = "";
      state.success = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFirstLoad: (state, action) => {
      state.firstLoad = true;
      console.log(
        "🚀 ~ file: index.ts ~ line 150 ~ state.firstLoad ",
        state.firstLoad
      );
    },
    setUser: (state, { payload }: any) => {
      state.currentUser = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUpUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(signUpUser.fulfilled, (state, { payload }) => {
      state.error = "";
      state.loading = false;
      state.success =
        "A verification email has been sent to your registered email.";
    });
    builder.addCase(signUpUser.rejected, (state, { payload }: any) => {
      state.success = "";
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(signupUserPhone.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      signupUserPhone.fulfilled,
      (state, { payload: { user } }: any) => {
        state.error = "";
        state.currentUser = user;
        state.loading = false;
        state.success = "";
        console.log("🚀 ~ file: index.ts ~ line 211 ~ state", state);
        // console.log(state);
      }
    );
    builder.addCase(signupUserPhone.rejected, (state, { payload }: any) => {
      state.success = "";
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(loginUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, { payload: { user } }: any) => {
        state.error = "";
        state.currentUser = user;
        state.loading = false;
        console.log(state);
      }
    );
    builder.addCase(loginUser.rejected, (state, { payload }: any) => {
      state.success = "";
      state.loading = false;
      state.error = payload;
      // console.log(payload);
    });
    builder.addCase(loginUserPhone.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      loginUserPhone.fulfilled,
      (state, { payload: { user } }: any) => {
        state.error = "";
        state.currentUser = user;
        state.loading = false;
        state.success = "";
        console.log(state);
      }
    );
    builder.addCase(loginUserPhone.rejected, (state, { payload }: any) => {
      state.success = "";
      state.loading = false;
      state.error = payload;
      // console.log(payload);
    });
    builder.addCase(logOutUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(logOutUser.fulfilled, (state) => {
      state.error = "";
      state.currentUser = null;
      state.loading = false;
      // console.log(state);
    });
    builder.addCase(logOutUser.rejected, (state, { payload }: any) => {
      state.success = "";
      state.loading = false;
      state.error = payload;
      // console.log(payload);
    });
    builder.addCase(updateUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      state.error = "";
      state.currentUser = { ...state.currentUser, ...payload };
      console.log(
        "🚀 ~ file: index.ts ~ line 354 ~ builder.addCase ~ payload",
        payload
      );
      state.loading = false;
      // console.log(state);
    });
    builder.addCase(updateUser.rejected, (state, { payload }: any) => {
      state.success = "";
      state.loading = false;
      state.error = payload;
      // console.log(payload);
    });
  },
});

export const { setError, setFirstLoad, setSuccess, setUser, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
