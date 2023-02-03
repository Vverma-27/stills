import { IUser } from "../auth/types";

export interface IFriendReducer {
  friends: IUser[];
  suggestions: IUser[];
  contactSuggestions: IUser[];
  loading: boolean;
  error?: string;
  success?: string;
}

export enum FriendRelations {
  FRIENDS = "FRIENDS",
  REQUESTED = "REQUESTED",
  BLOCKED = "BLOCKED",
  NO_RELATION = "NO_RELATION",
}
