import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { IAppState } from "../redux";
import { FontAwesome } from "@expo/vector-icons";

const ToastContainer = () => {
  const { error, success } = useSelector((state: IAppState) => state.auth);
  if (!error && !success) return null;
  return (
    <View style={[styles.toast, styles[`toast--${Boolean(error)}`]]}>
      <FontAwesome
        name={error ? "exclamation-circle" : "check-circle"}
        color={error ? "red" : "#4DB192"}
        size={20}
        style={{ marginRight: 10 }}
      />
      <Text style={styles.toastText}>{error || success}</Text>
    </View>
  );
};

export default ToastContainer;

const styles = StyleSheet.create({
  toast: { flexDirection: "row", padding: 8, alignItems: "center" },
  toastText: { fontSize: 11, fontWeight: "700" },
  "toast--false": {
    borderWidth: 2,
    borderColor: "#4DB192",
    borderRadius: 8,
  },
  "toast--true": {
    borderWidth: 2,
    borderColor: "red",
    borderRadius: 8,
  },
});
