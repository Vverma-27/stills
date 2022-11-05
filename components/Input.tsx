import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ReturnKeyTypeOptions,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

import colors from "../constants/colors";
import { forwardRef } from "react";

const Input = forwardRef(
  (
    props: {
      label: string;
      autoCapitalize?:
        | "none"
        | "sentences"
        | "words"
        | "characters"
        | undefined;
      icon?: React.ComponentProps<typeof Ionicons>["name"];
      errorText?: string;
      type: KeyboardTypeOptions;
      iconSize?: number;
      isPassword?: boolean;
      showPassword?: boolean;
      style?: any;
      placeholder?: string;
      setShowPassword?: any;
      value: any;
      editable?: boolean;
      setValue: any;
      blurOnSubmit?: boolean;
      returnKeyType?: ReturnKeyTypeOptions;
      onSubmitEditing?:
        | ((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void)
        | undefined;
    },
    ref
  ) => {
    return (
      <View style={[styles.container, props.style]}>
        <Text style={styles.label}>{props.label}</Text>

        <View style={styles.inputContainer}>
          {props.icon && (
            <Ionicons
              name={props.icon}
              size={props.iconSize || 18}
              style={styles.icon}
            />
          )}
          <TextInput
            style={styles.input}
            keyboardType={props.type}
            secureTextEntry={props.isPassword && !props.showPassword}
            placeholder={props.placeholder}
            value={props.value}
            editable={props.editable ?? true}
            autoCapitalize={props.autoCapitalize}
            onSubmitEditing={props.onSubmitEditing}
            returnKeyType={props.returnKeyType}
            //@ts-ignore
            ref={ref}
            blurOnSubmit={props.blurOnSubmit ?? true}
            onChangeText={(text) => {
              props.setValue(text);
            }}
          />
          {props.isPassword && (
            <Pressable
              onPress={() => props.setShowPassword((sp: boolean) => !sp)}
            >
              <Ionicons
                name={props.showPassword ? "eye-off" : "eye"}
                size={props.iconSize || 18}
                style={styles.icon}
              />
            </Pressable>
          )}
        </View>

        {props.errorText && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{props.errorText}</Text>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginVertical: 8,
    fontWeight: "bold",
    letterSpacing: 0.3,
    color: "#000",
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 2,
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
    color: "#4DB192",
  },
  input: {
    color: "#000",
    flex: 1,
    fontWeight: "400",
    letterSpacing: 0.3,
    paddingTop: 0,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
});

export default Input;
