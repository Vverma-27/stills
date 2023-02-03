import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./auth";
import friendReducer from "./friends";
import { IAuthReducer } from "./auth/types";
import { IFriendReducer } from "./friends/types";
export interface IAppState {
  auth: IAuthReducer;
  friend: IFriendReducer;
}
const store = configureStore({
  reducer: {
    auth: authReducer,
    friend: friendReducer,
  },
});
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = (selector: (state: IAppState) => any) =>
  useSelector(selector);
export default store;
