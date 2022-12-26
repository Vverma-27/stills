export interface IAuthReducer {
  // name: string;
  currentUser: IUser | null;
  loading: boolean;
  firstLoad?: boolean;
  error?: string;
  success?: string;
}

export interface IUser {
  name: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  profile_picture?: string | null;
  uid: string | null;
  username: string | null;
  createdAt?: string | null;
  coverImage?: string | null;
  age?: number | null;
  dob?: string | null;
  providerType?: "email" | "phone";
}
