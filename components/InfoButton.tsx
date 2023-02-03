import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

const InfoButton = ({
  PrecedingIcon,
  SucceedingIcon,
  title,
  onPress,
}: {
  PrecedingIcon?: JSX.Element;
  SucceedingIcon?: JSX.Element;
  title: string;
  onPress: any;
}) => {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <View style={styles.itemContent}>
        {PrecedingIcon}
        <Text style={styles.itemContentTitle}>{title}</Text>
      </View>
      {SucceedingIcon}
    </Pressable>
  );
};

export default InfoButton;

const styles = StyleSheet.create({
  item: {
    width: "100%",
    borderRadius: 7,
    elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    alignItems: "center",
    marginBottom: 10,
  },
  itemContent: { flexDirection: "row", alignItems: "center" },
  itemContentTitle: { fontSize: 14 },
});
