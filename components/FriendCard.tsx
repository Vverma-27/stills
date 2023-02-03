import { Pressable, View, Image, Text, StyleSheet } from "react-native";
import { IUser } from "../redux/auth/types";

const FriendCard = ({
  user,
  isContact,
  onPress,
}: {
  user: IUser;
  isContact?: boolean;
  onPress: (t: string) => void;
}) => {
  // console.log("🚀 ~ file: AddFriends.tsx:16 ~ ContactCard ~ user", user);
  return (
    <Pressable
      style={styles.FriendCard}
      onPress={() => onPress(user.uid || "")}
    >
      {/* <View></View> */}
      <Image
        source={
          user?.profile_picture ||
          require("../assets/images/default-profile-picture.png")
        }
      />
      <View style={styles.userInfo}>
        <Text style={styles.suggestionName}>{user.name}</Text>
        <Text style={styles.suggestionUsername}>@{user.username}</Text>
        <Text style={styles.suggestionFrom}>
          {isContact ? "From Contacts" : "Mutual Friend"}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  FriendCard: {
    width: "100%",
    padding: 6,
    elevation: 4,
    backgroundColor: "white",
    borderRadius: 6,
    // height: 50,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  suggestionName: { fontSize: 18, fontWeight: "600" },
  suggestionUsername: { fontSize: 14, fontWeight: "600" },
  suggestionDp: {},
  userInfo: { justifyContent: "flex-start" },
  suggestionFrom: { fontSize: 10, fontWeight: "800" },
});

export default FriendCard;
