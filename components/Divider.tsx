import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Divider = ({ text }: { text: string }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
      <View>
        <Text style={{ width: 50, textAlign: "center", fontWeight: "900" }}>
          {text}
        </Text>
      </View>
      <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
    </View>
  );
};

export default Divider;
