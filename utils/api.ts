import axios from "axios";
import { IUser } from "../redux/auth/types";
import { auth } from "../services/firebase";

const baseAxios = axios.create({
  baseURL: "http://59c7-223-225-30-144.ngrok.io/api",
});

export const phoneNumberExists = async (phoneNumber: string) => {
  try {
    const {
      data: { valid },
    } = await baseAxios.post("/user/phoneExists", {
      phoneNumber,
    });
    return valid;
  } catch (e) {
    console.log(e);
  }
};

export const emailExists = async (email: string) => {
  try {
    const {
      data: { valid },
    } = await baseAxios.post("/user/emailExists", {
      email,
    });
    return valid;
  } catch (e) {
    console.log(e);
  }
};

export const setUserData = async (payload: IUser) => {
  try {
    const {
      data: { user },
    } = await baseAxios.post("/user/", { user: payload });
    return user;
  } catch (e) {
    console.log(e);
  }
};

export const updateUserData = async (payload: Partial<IUser>) => {
  try {
    const authtoken = await auth.currentUser?.getIdToken();
    const {
      data: { user },
    } = await baseAxios.patch(
      "/user/",
      { user: payload },
      { headers: { authtoken } }
    );
    return user;
  } catch (e) {
    console.log(e);
  }
};

export const checkUsernameValidity = async (username: string) => {
  try {
    const {
      data: { valid },
    } = await baseAxios.post("/user/usernameValid", { username });
    return valid;
  } catch (error) {
    console.log(error);
  }
};

export const getUserData = async (uid: string) => {
  try {
    const {
      data: { user },
    } = await baseAxios.get("/user/?uid=" + uid);
    return user;
  } catch (error) {
    console.log("🚀 ~ file: api.ts ~ line 61 ~ getUserData ~ error", error);
  }
};

export const getFriendMetaData = async (friendUid: string) => {
  try {
    const authtoken = await auth.currentUser?.getIdToken();
    const {
      data: { relation },
    } = await baseAxios.get("/friends/meta?friendUid=" + friendUid, {
      headers: { authtoken },
    });
    return relation;
  } catch (error) {
    console.log("🚀 ~ file: api.ts ~ line 61 ~ getUserData ~ error", error);
  }
};

export const loadFriends = async () => {
  try {
    const authtoken = await auth.currentUser?.getIdToken();
    const {
      data: { friends },
    } = await baseAxios.get("/friends", { headers: { authtoken } });
    return friends;
  } catch (error) {
    console.log("🚀 ~ file: api.ts ~ line 61 ~ getUserData ~ error", error);
  }
};

export const getSuggestionsFromContacts = async (contacts: string[]) => {
  console.log(
    "🚀 ~ file: api.ts:97 ~ getSuggestionsFromContacts ~ contacts",
    JSON.stringify(contacts)
  );
  try {
    const authtoken = await auth.currentUser?.getIdToken();
    const {
      data: { suggestions },
    } = await baseAxios.get(
      "/friends/contacts?contacts=" + JSON.stringify(contacts),
      { headers: { authtoken } }
    );
    return suggestions;
  } catch (error) {
    console.log("🚀 ~ file: api.ts ~ line 61 ~ getUserData ~ error", error);
  }
};

export const getSuggestions = async () => {
  try {
    const authtoken = await auth.currentUser?.getIdToken();
    const {
      data: { suggestions },
    } = await baseAxios.get("/friends/suggestions", { headers: { authtoken } });
    return suggestions;
  } catch (error) {
    console.log("🚀 ~ file: api.ts ~ line 61 ~ getUserData ~ error", error);
  }
};
