import { Camera, CameraType, FlashMode } from "expo-camera";
import { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  View,
  Image,
  ToastAndroid,
  ImageSourcePropType,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { RootTabScreenProps } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function CameraScreen({
  navigation,
}: RootTabScreenProps<"Camera">) {
  const [type, setType] = useState<CameraType>(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState<Camera | null>(null);
  // console.log("🚀 ~ file: CameraScreen.tsx ~ line 26 ~ camera", camera);

  const [ratio, setRatio] = useState("4:3"); // default is 4:3
  // console.log("🚀 ~ file: CameraScreen.tsx ~ line 28 ~ ratio", ratio);
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off);
  const [image, setImage] = useState<string>();
  const [flashIconName, setFlashIconName] =
    useState<React.ComponentProps<typeof Ionicons>["name"]>("flash");
  useEffect(() => {
    switch (flashMode) {
      case FlashMode.off:
        setFlashIconName("flash-off");
        break;
      case FlashMode.on:
        setFlashIconName("flash");
        break;
      case FlashMode.auto:
        setFlashIconName("flashlight");
        break;

      default:
        break;
    }
  }, [flashMode]);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View
        style={[styles.container, { justifyContent: "center", padding: 16 }]}
      >
        <Text style={{ textAlign: "center", color: "#fff", marginBottom: 10 }}>
          We need your permission to show the camera
        </Text>
        <Button
          onPress={requestPermission}
          title="grant permission"
          color="#4DB192"
        />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }
  function toggleFlash() {
    setFlashMode((flashMode) =>
      flashMode === FlashMode.off
        ? FlashMode.on
        : flashMode === FlashMode.on
        ? FlashMode.auto
        : flashMode === FlashMode.auto
        ? FlashMode.torch
        : FlashMode.off
    );
  }
  const captureImage = async () => {
    const image = await camera?.takePictureAsync({ base64: true });
    if (!image) {
      ToastAndroid.show(
        "Could not capture photo. Please Try Again.",
        ToastAndroid.SHORT
      );
      return;
    }
    setImage(image.base64);
  };
  const prepareRatio = async () => {
    // let desiredRatio = "50:23"; // Start with the system default
    // // This issue only affects Android
    if (Platform.OS === "android") {
      const ratios = (await camera?.getSupportedRatiosAsync()) || [];
      // console.log(
      //   "🚀 ~ file: CameraScreen.tsx ~ line 106 ~ prepareRatio ~ ratios",
      //   ratios
      // );
      // console.log(ratios);
      //   //   // Calculate the width/height of each of the supported camera ratios
      //   //   // These width/height are measured in landscape mode
      //   //   // find the ratio that is closest to the screen ratio without going over
      //   //   // let distances = {};
      //   //   let realRatios: number[] = [];
      //   //   // let minDistance = null;
      //   for (const ratio of ratios) {
      //     console.log(ratio);
      //   }
      //   for (const i in ratios) {
      //     const ratio = ratios[i]
      //     const parts = ratio.split(":");
      //     const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
      //     realRatios[i] = realRatio;
      //     // ratio can't be taller than screen, so we don't want an abs()
      //     // const distance = screenRatio - realRatio;
      //     //@ts-ignore
      //     // distances[ratio] = realRatio;
      //     // if (minDistance == null) {
      //     //   minDistance = ratio;
      //     // } else {
      //     //   //@ts-ignore
      //     //   if (distance >= 0 && distance < distances[minDistance]) {
      //     //     minDistance = ratio;
      //     //   }
      //     // }
      //   }
      // // set the best match
      // //@ts-ignore
      // desiredRatio = minDistance;
      // //  calculate the difference between the camera width and the screen height
      // const remainder = Math.floor(
      //   //@ts-ignore
      //   (height - realRatios[desiredRatio] * width) / 2
      // );
      // // set the preview padding and preview ratio
      // setImagePadding(remainder);
      const ratio = ratios[ratios.length - 1];
      setRatio(ratio);
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      // setIsRatioSet(true);
    }
  };

  // the camera must be loaded in order to access the supported ratios
  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };
  if (image)
    return (
      <SafeAreaView style={styles.container}>
        <Image
          source={{ uri: "data:image/jpg;base64," + image }}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Camera
        type={type}
        onMountError={(e) => {
          console.log("🚀 ~ file: CameraScreen.tsx ~ line 176 ~ e", e);
          // return console.log(e)}
        }}
        style={[
          // { marginTop: imagePadding, marginBottom: imagePadding },
          styles.camera,
        ]}
        onCameraReady={setCameraReady}
        ratio={ratio}
        ref={(ref: NonNullable<Camera>) => {
          setCamera(ref);
        }}
        flashMode={flashMode}
      >
        <View style={styles.buttonContainer}>
          <View style={{ flexDirection: "row" }}>
            <Pressable
              style={[styles.iconContainer, { marginRight: 20 }]}
              onPress={() => navigation.navigate("Profile")}
            >
              <Ionicons name="person" size={26} color="white" />
            </Pressable>
            <Pressable style={styles.iconContainer}>
              <Ionicons name="search" size={26} color="white" />
            </Pressable>
          </View>
          <View style={styles.toolsColumn}>
            <Pressable
              style={[styles.iconContainer, { marginBottom: 12 }]}
              onPress={toggleCameraType}
            >
              <Ionicons name="camera-reverse" size={26} color="white" />
            </Pressable>
            <Pressable style={styles.iconContainer} onPress={toggleFlash}>
              {flashMode !== FlashMode.auto ? (
                <Ionicons name={flashIconName} size={26} color="white" />
              ) : (
                <MaterialIcons name="flash-auto" size={26} color="white" />
              )}
            </Pressable>
          </View>
        </View>
        <Pressable style={styles.captureButton} onPress={captureImage} />
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  camera: {
    flex: 1,
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
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  captureButton: {
    position: "absolute",
    bottom: 80,
    left: "50%",
    height: 100,
    width: 100,
    borderRadius: 300,
    transform: [{ translateX: -50 }],
    backgroundColor: "transparent",
    borderWidth: 10,
    borderColor: "#eee",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    borderRadius: 200,
    backgroundColor: "#777",
  },
  toolsColumn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 500,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
});
