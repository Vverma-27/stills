import React from "react";
import { StyleSheet, Pressable, Text, ActivityIndicator } from "react-native";

const LogoutButton = (props: any) => {
  const enabledBgColor = props.color;
  const disabledBgColor = "#eee";
  const bgColor = props.loading ? disabledBgColor : enabledBgColor;

  return (
    <Pressable
      onPress={props.loading ? () => {} : props.onPress}
      style={{
        ...styles.button,
        ...props.style,
        ...{ backgroundColor: bgColor },
      }}
    >
      {!props.loading ? (
        <Text
          style={{
            color: props.loading ? "#777" : "white",
            fontWeight: "700",
            fontSize: 16,
          }}
        >
          {props.title}
        </Text>
      ) : (
        <ActivityIndicator color="#777" />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LogoutButton;
