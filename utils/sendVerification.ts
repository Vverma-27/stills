import { PhoneAuthProvider } from "firebase/auth/react-native";
import { auth } from "../services/firebase";
import { phoneNumberExists } from "./api";

const sendVerificationCode = async (
  phoneNumber: string,
  onError: (t: string) => void,
  recaptchaVerifier: any,
  signIn?: boolean
): Promise<string> => {
  try {
    console.log(
      "🚀 ~ file: SettingsEdit.tsx ~ line 61 ~ sendVerificationCode ~ phoneNumber",
      phoneNumber
    );
    const phoneNumberExist = await phoneNumberExists(phoneNumber);
    if (signIn && !phoneNumberExist)
      onError("Account linked to this number doesn't exist.");
    if (!signIn && phoneNumberExist)
      onError("Account linked to this number already exists.");
    else {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier
      );
      console.log(
        "🚀 ~ file: SettingsEdit.tsx ~ line 71 ~ sendVerificationCode ~ verificationId",
        verificationId
      );
      return verificationId;
    }
  } catch (err: any) {
    const { code, message } = err;
    if (code === "auth/invalid-phone-number") onError("Invalid Phone Number");
    else if (code === "auth/too-many-requests")
      onError("Too many requests. Please try later.");
    else onError(message);
  }
  return "";
};

export default sendVerificationCode;
