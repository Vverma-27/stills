import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { IAppState, useAppDispatch } from "../redux";
import { logOutUser } from "../redux/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import SvgLogo from "../components/SvgLogo";
import ProfileHeader from "../components/ProfileHeader";
import { RootStackScreenProps } from "../types";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { findSign, SunSign } from "../utils/helpers";
import LogoutButton from "../components/LogoutButton";
import { auth } from "../services/firebase";
import { Link } from "@react-navigation/native";
import InfoButton from "../components/InfoButton";
import { getFriendMetaData, getUserData } from "../utils/api";
import SubmitButton from "../components/SubmitButton";
import { FriendRelations } from "../redux/friends/types";

const ProfileScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"Profile">) => {
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    const resp = await dispatch(logOutUser("h"));
    if (resp.meta.requestStatus === "fulfilled") navigation.navigate("SignIn");
  };
  const { loading } = useSelector((state: IAppState) => state.auth);
  const { currentUser } = useSelector((state: IAppState) => state.auth);
  const [user, setUser] = useState(currentUser);
  const [meta, setMeta] = useState<FriendRelations>(
    FriendRelations.NO_RELATION
  );
  useEffect(() => {
    if (route?.params?.uid) {
      console.log(
        "🚀 ~ file: ProfileScreen.tsx:36 ~ useEffect ~ route?.params?.uid",
        route?.params?.uid
      );
      (async () => {
        const user = await getUserData(route?.params?.uid || "");
        const relation = await getFriendMetaData(route?.params?.uid || "");
        setMeta(relation);
        setUser(user);
      })();
    }
  }, [route?.params?.uid]);
  console.log("🚀 ~ file: ProfileScreen.tsx:38 ~ user", user);
  const sunSign = useMemo(
    //@ts-ignore
    () => SunSign[findSign(new Date(user.dob))],
    [user?.dob]
  );
  console.log(
    "🚀 ~ file: ProfileScreen.tsx:32 ~ ProfileScreen ~ sunSign",
    sunSign
  );
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.coverImageContainer}>
        <SvgLogo />
      </View>
      <ProfileHeader style={styles.buttonContainer} navigation={navigation} />
      <View style={styles.informationContainer}>
        <View style={styles.userInfo}>
          <Image
            style={styles.profilePicture}
            source={
              user?.profile_picture ||
              require("../assets/images/default-profile-picture.png")
            }
          />
          <View style={{ justifyContent: "flex-start", marginLeft: 10 }}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.username}>{user?.username}</Text>
          </View>
        </View>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Ionicons
              name="bonfire"
              size={14}
              color="#4DB192"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.stillScore}>3,029</Text>
          </View>
          <View style={styles.badge}>
            <View
              style={{
                backgroundColor: sunSign.color,
                padding: 6,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <MaterialCommunityIcons
                //@ts-ignore
                name={`zodiac-${sunSign.name.toLowerCase()}`}
                size={14}
                color={"#fff"}
              />
            </View>
            <Text style={styles.stillScore}>{sunSign.name}</Text>
          </View>
        </View>
        {route?.params?.uid ? (
          <View>
            {meta === FriendRelations.FRIENDS ? (
              <View style={{ flexDirection: "row" }}>
                {/* <FontAwesome5 */}
                <FontAwesome5 name="user-friends" size={24} color="black" />
                <Text>Friends since 20th January</Text>
              </View>
            ) : null}
            <LogoutButton
              title={(() => {
                let title = "";
                switch (meta) {
                  case FriendRelations.NO_RELATION:
                    title = "Add Friend";
                    break;
                  case FriendRelations.FRIENDS:
                    title = "Remove Friend";
                  case FriendRelations.REQUESTED:
                    title = "Requested";
                }
                return title;
              })()}
              onPress={() => {}}
              style={{ marginTop: 20, width: "100%" }}
              color={(() => {
                let color = "";
                switch (meta) {
                  case FriendRelations.NO_RELATION:
                    color = "#4DB192";
                    break;
                  case FriendRelations.FRIENDS:
                    color = "#FF7B7B";
                  case FriendRelations.REQUESTED:
                    color = "#777";
                }
                return color;
              })()}
              loading={loading}
            />
          </View>
        ) : (
          <>
            {!auth.currentUser?.emailVerified ? (
              <View style={styles.section}>
                <View style={styles.sectionList}>
                  <View style={styles.sectionListItem}>
                    <View style={styles.sectionListItemContent}>
                      <Ionicons
                        name="mail"
                        size={24}
                        color="rgba(0,0,0,0.8)"
                        style={{ marginRight: 10 }}
                      />
                      <Pressable
                        onPress={() =>
                          navigation.navigate("ConfirmLogin", {
                            title: "email",
                          })
                        }
                      >
                        <Text style={styles.sectionListItemContentTitle}>
                          {user?.email ? "Verify" : "Add"} Your Email
                        </Text>
                      </Pressable>
                    </View>
                    <Ionicons name="close" size={22} color="rgba(0,0,0,0.8)" />
                  </View>
                </View>
              </View>
            ) : null}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Friends</Text>
              <View style={styles.sectionList}>
                <InfoButton
                  onPress={() => navigation.navigate("AddFriends")}
                  PrecedingIcon={
                    <Ionicons
                      name="person-add"
                      size={24}
                      color="rgba(0,0,0,0.8)"
                      style={{ marginRight: 10 }}
                    />
                  }
                  SucceedingIcon={
                    <Ionicons
                      name="chevron-forward"
                      size={22}
                      color="rgba(0,0,0,0.8)"
                    />
                  }
                  title="Add Friends"
                />
                <InfoButton
                  onPress={() => navigation.navigate("MyFriends")}
                  PrecedingIcon={
                    <FontAwesome5
                      name="user-friends"
                      size={24}
                      color="rgba(0,0,0,0.8)"
                      style={{ marginRight: 10 }}
                    />
                  }
                  SucceedingIcon={
                    <Ionicons
                      name="chevron-forward"
                      size={22}
                      color="rgba(0,0,0,0.8)"
                    />
                  }
                  title="My Friends"
                />
              </View>
            </View>
            <LogoutButton
              title="Log Out"
              onPress={handleLogout}
              style={{ marginTop: 20, width: "100%" }}
              color="#FF7B7B"
              loading={loading}
            />
          </>
        )}
        {/* <Pressable onPress={} style={{ backgroundColor: "#fff" }}>
          <Text style={{ color: "#000" }}>Log Out</Text>
        </Pressable> */}
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    // paddingHorizontal: 16,
  },
  coverImage: { width: "100%", resizeMode: "cover", height: "100%" },
  coverImageContainer: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    alignItems: "center",
    position: "relative",
  },
  buttonContainer: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "absolute",
    top: 45,
    width: "100%",
    left: 0,
    right: 0,
    paddingHorizontal: 0,
  },
  profilePicture: {},
  informationContainer: {
    marginTop: -30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    elevation: 2,
    // borderTopLeftRadius: 10,
    flex: 1,
  },
  username: { fontSize: 12, fontWeight: "300" },
  userInfo: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "red",
  },
  name: {
    fontSize: 24,
    // flex: 1,
    fontWeight: "800",
    marginBottom: 6,
  },
  badges: {
    marginTop: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    borderRadius: 20,
    padding: 2,
    paddingHorizontal: 6,
    borderColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // width: 70,
    marginRight: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  stillScore: {},
  section: {
    marginTop: 16,
    width: "100%",
    alignSelf: "flex-start",
  },
  sectionHeading: {
    fontWeight: "900",
    fontSize: 16,
    color: "#777",
    marginBottom: 8,
  },
  sectionList: {},
  sectionListItem: {
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
  sectionListItemContent: { flexDirection: "row", alignItems: "center" },
  sectionListItemContentTitle: { fontSize: 14 },
});
