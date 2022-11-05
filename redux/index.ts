import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "./auth";
import { IAuthReducer } from "./auth/types";
export interface IAppState {
  auth: IAuthReducer;
}
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
