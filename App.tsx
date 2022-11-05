import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
// import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import useSignInStatus from "./hooks/useSignInStatus";
import Navigation from "./navigation";
import store from "./redux";

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  useSignInStatus();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider
        style={{ flex: 1 }}
        onLayout={() => {
          SplashScreen.hideAsync();
        }}
      >
        <Navigation colorScheme={colorScheme} />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }
}
