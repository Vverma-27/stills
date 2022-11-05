import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Input from "../components/Input";
import { Feather, Ionicons } from "@expo/vector-icons";
import SubmitButton from "../components/SubmitButton";
import { RootStackScreenProps } from "../types";
import GoogleButton from "../components/GoogleButton";
import Divider from "../components/Divider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../redux/auth";
import { IAppState, useAppDispatch } from "../redux";

const SignUpDOBForm = (props: any) => {
  const [mode, setMode] = useState<any>("date");
  const [show, setShow] = useState(false);
  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    props.setDate(currentDate);
  };
  const showSelector = () => {
    setShow(true);
  };
  const datestring = props.date?.toString().split(" ").slice(0, 4);
  //   const [firstname, setFirstName] = useState("");
  //   const [lastName, setLastName] = useState("");
  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: IAppState) => state.auth);
  return (
    <>
      <View style={styles.form}>
        <Text style={styles.label}>Your Birthday</Text>
        {datestring ? (
          <Text style={styles.dob}>
            {`${datestring[0]}, ${datestring[2]} ${datestring[1]}, ${datestring[3]}`}
          </Text>
        ) : null}
        <Pressable
          onPress={showSelector}
          style={{
            marginTop: 16,
            borderRadius: 10,
            justifyContent: "flex-start",
            paddingHorizontal: 10,
            paddingVertical: 6,
            alignItems: "center",
            // backgroundColor: "#4DB192",
          }}
        >
          <Text style={{ color: "#4DB192", fontWeight: "600" }}>
            Change DOB
          </Text>
        </Pressable>
        {(show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={props.date || new Date()}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )) ||
          null}
      </View>
      <SubmitButton
        title="Continue"
        onPress={props.handleSubmit}
        style={{ marginTop: 20, width: "100%" }}
        color="#4DB192"
        loading={loading}
      />
    </>
  );
};

export default SignUpDOBForm;

const styles = StyleSheet.create({
  label: {
    marginVertical: 8,
    fontWeight: "bold",
    letterSpacing: 0.3,
    fontSize: 16,
    textAlign: "center",
    color: "#000",
  },
  dob: {
    marginVertical: 10,
    fontWeight: "300",
    letterSpacing: 0.3,
    fontSize: 24,
    textAlign: "center",
    color: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
    alignItems: "center",
    // overflow: "scroll",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  disclaimer: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 16,
    textAlign: "center",
    color: "rgba(0,0,0,0.4)",
  },
  form: { marginBottom: 20 },
  existing: {
    fontSize: 11,
    fontWeight: "900",
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  link: { fontWeight: "900", color: "#4DB192" },
});
