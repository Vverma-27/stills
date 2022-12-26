import axios from "axios";
import { IUser } from "../redux/auth/types";

const baseAxios = axios.create({
  baseURL: "http://50da-49-36-177-95.ngrok.io/api/user",
});

export const phoneNumberExists = async (phoneNumber: string) => {
  try {
    const {
      data: { valid },
    } = await baseAxios.post("/phoneExists", {
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
    } = await baseAxios.post("/emailExists", {
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
    } = await baseAxios.post("/", { user: payload });
    return user;
  } catch (e) {
    console.log(e);
  }
};

export const updateUserData = async (payload: Partial<IUser>) => {
  try {
    const {
      data: { user },
    } = await baseAxios.patch("/", { user: payload });
    return user;
  } catch (e) {
    console.log(e);
  }
};

export const checkUsernameValidity = async (username: string) => {
  try {
    const {
      data: { valid },
    } = await baseAxios.post("/usernameValid", { username });
    return valid;
  } catch (error) {
    console.log(error);
  }
};

export const getUserData = async (uid: string) => {
  try {
    const {
      data: { user },
    } = await baseAxios.get("/?uid=" + uid);
    return user;
  } catch (error) {
    console.log("🚀 ~ file: api.ts ~ line 61 ~ getUserData ~ error", error);
  }
};
