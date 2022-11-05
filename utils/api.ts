import axios from "axios";
import { IUser } from "../redux/auth/types";

const baseAxios = axios.create({
  baseURL: "http://192.168.56.1:3000/api/user/",
});

export const phoneNumberExists = async (phoneNumber: string) => {
  try {
    const {
      data: { valid },
    } = await baseAxios.post("/phoneValid", {
      phoneNumber,
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
    console.log(error);
  }
};
