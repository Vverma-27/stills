/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Chats: {
            screens: {
              ChatScreen: "chat",
            },
          },
          Camera: {
            screens: {
              CameraScreen: "camera",
            },
          },
          Activity: {
            screens: {
              ActivityScreen: "activity",
            },
          },
        },
      },
      SignIn: "signin",
      SignUp: "signup",
      ResetPassword: "reset",
      Profile: "profile",
    },
  },
};

export default linking;
