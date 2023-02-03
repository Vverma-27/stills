/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Ionicons } from "@expo/vector-icons";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName, Pressable, View } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import CameraScreen from "../screens/CameraScreen";
import ChatScreen from "../screens/ChatScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import ActivityScreen from "../screens/ActivityScreen";
import Header from "../components/Header";
import SignInScreen from "../screens/SignInScreen";
import ResetPassword from "../screens/ResetPassword";
import SignUpScreen from "../screens/SignUpScreen";
import { useSelector } from "react-redux";
import { IAppState } from "../redux";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileHeader from "../components/ProfileHeader";
import SettingsScreen from "../screens/SettingsScreen";
import SettingsEditScreen from "../screens/SettingsEdit";
import ConfirmLogin from "../screens/ConfirmLogin";
import AddFriends from "../screens/AddFriends";
import MyFriends from "../screens/MyFriends";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const isLoggedIn = useSelector(
    (state: IAppState) =>
      state.auth.currentUser && Object.keys(state.auth.currentUser).length
  );
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
            <Stack.Screen
              name="AddFriends"
              component={AddFriends}
              options={{ headerShown: true, headerTitle: "Add Friends" }}
            />
            <Stack.Screen
              name="MyFriends"
              component={MyFriends}
              options={{ headerShown: true, headerTitle: "My Friends" }}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="SettingsEdit"
              component={SettingsEditScreen}
              options={({ route }) => ({
                headerShown: true,
                headerBackImage: () => (
                  <Ionicons name="chevron-back" size={24} color="#4DB192" />
                ),
                headerTitle: route.params.title,
                headerTitleAlign: "left",
                headerTitleStyle: {
                  color: "#4DB192",
                  textTransform: "capitalize",
                },
              })}
            />
          </Stack.Group>
          <Stack.Group
            screenOptions={{
              presentation: "modal",
              headerShown: true,
              headerBackImage: () => (
                <Ionicons name="chevron-back" size={24} color="#4DB192" />
              ),
              headerTitleAlign: "left",
              headerTitleStyle: { color: "#4DB192" },
            }}
          >
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen
              name="ConfirmLogin"
              component={ConfirmLogin}
              options={{
                title: "Authenticate",
              }}
            />
          </Stack.Group>
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </>
      )}
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Camera"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.6)",
        },
        header: (props) => {
          // const title = getHeaderTitle(options, route.name);
          return <Header {...props} />;
        },
      }}
    >
      <BottomTab.Screen
        name="Chats"
        component={ChatScreen}
        options={{
          tabBarShowLabel: false,
          title: "Chats",
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="chatbox" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Camera"
        component={CameraScreen}
        options={({ navigation }: RootTabScreenProps<"Camera">) => ({
          unmountOnBlur: true,
          // title: "",
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="camera" color={color} size={size} />
          ),
          // headerRight: () => (
          //   <Pressable
          //     onPress={() => navigation.navigate("Modal")}
          //     style={({ pressed }) => ({
          //       opacity: pressed ? 0.5 : 1,
          //     })}
          //   >
          //     <FontAwesome
          //       name="info-circle"
          //       size={25}
          //       color={Colors[colorScheme].text}
          //       style={{ marginRight: 15 }}
          //     />
          //   </Pressable>
          // ),
        })}
      />
      <BottomTab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarShowLabel: false,
          title: "Activity",
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="people" color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  size: number;
}) {
  return <Ionicons style={{ marginBottom: -3 }} {...props} />;
}
