import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSuggestions,
  getSuggestionsFromContacts,
  loadFriends,
} from "../../utils/api";
import { IUser } from "../auth/types";
import { IFriendReducer } from "./types";
const initialState: IFriendReducer = {
  friends: [],
  suggestions: [],
  contactSuggestions: [],
  loading: false,
};

export const getFriends = createAsyncThunk(
  "friend/loadFriends",
  async (t: string = "", { rejectWithValue }) => {
    try {
      return loadFriends();
    } catch (error) {
      console.log("🚀 ~ file: index.ts:14 ~ getFriends ~ error", error);
    }
  }
);

export const getFriendsFromContacts = createAsyncThunk(
  "friend/getFriendsFromContacts",
  async (contacts: string[], { rejectWithValue }) => {
    try {
      return getSuggestionsFromContacts(contacts);
    } catch (error) {
      console.log("🚀 ~ file: index.ts:14 ~ getFriends ~ error", error);
      return rejectWithValue(error);
    }
  }
);

export const getFriendSuggestions = createAsyncThunk(
  "friend/getSuggestions",
  async (t: string = "", { rejectWithValue }) => {
    try {
      return getSuggestions();
    } catch (error) {
      console.log("🚀 ~ file: index.ts:14 ~ getFriends ~ error", error);
      return rejectWithValue(error);
    }
  }
);

const friendSlice: any = createSlice({
  name: "friend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFriends.fulfilled, (state, action) => {
      // console.log("🚀 ~ file: index.ts:40 ~ builder.addCase ~ action", action);
      state.friends = action.payload;
      state.loading = false;
    });
    builder.addCase(getFriends.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getFriends.rejected, (state, action) => {
      state.friends = [];
      state.loading = false;
      //   state.error="Int"
    });
    builder.addCase(getFriendsFromContacts.fulfilled, (state, action) => {
      // console.log("🚀 ~ file: index.ts:40 ~ builder.addCase ~ action", action);
      state.contactSuggestions = action.payload;
      state.loading = false;
    });
    builder.addCase(getFriendsFromContacts.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getFriendsFromContacts.rejected, (state, action) => {
      state.contactSuggestions = [];
      state.loading = false;
      //   state.error="Int"
    });
    builder.addCase(getFriendSuggestions.fulfilled, (state, action) => {
      // console.log("🚀 ~ file: index.ts:40 ~ builder.addCase ~ action", action);
      state.suggestions = action.payload.filter((sugg: IUser) => {
        !state.contactSuggestions.find((u) => {
          console.log(
            "🚀 ~ file: index.ts:74 ~ builder.addCase ~ u.uid === sugg.uid",
            u.uid === sugg.uid
          );
          return u.uid === sugg.uid;
        });
      });
      // state.loading = false;
    });
    builder.addCase(getFriendSuggestions.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getFriendSuggestions.rejected, (state, action) => {
      state.suggestions = [];
      state.loading = false;
    });
  },
});
export default friendSlice.reducer;
