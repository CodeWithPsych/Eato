import { images } from "@/constants";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (value, index) => {
    if (!value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-orange-50"
      >
        <View className="flex-1 justify-center items-center px-6">
          {/* Card */}
          <View className="w-full bg-white rounded-3xl p-6 shadow-lg items-center">
            {/* Icon */}
            <View className="w-16 h-16 rounded-full bg-orange-100 items-center justify-center mb-4">
              <Image source={images.envelope} className="w-8 h-8" />
            </View>

            {/* Title */}
            <Text className="text-lg font-semibold text-neutral-800 mb-1">
              Verify OTP
            </Text>
            <Text className="text-center text-neutral-500 mb-1">
              Enter the 6-digit code sent to
            </Text>
            <Text className="text-orange-600 mb-1">
              arhammalik900@yahoo.com
            </Text>
            <Text className="text-neutral-600 mb-6">9876543210</Text>

            {/* OTP Inputs */}
            <View className="flex-row justify-between w-full mb-6">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputsRef.current[index] = ref)}
                  value={digit}
                  onChangeText={(val) => handleChange(val, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace") {
                      handleBackspace(digit, index);
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  className="w-12 h-12 border border-gray-300 rounded-xl text-center text-lg"
                  style={{
                    textAlignVertical: "center",
                    paddingVertical: 0,
                  }}
                />
              ))}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              disabled={otp.join("").length < 6}
              onPress={() => router.push("/resturant/set_resturant")}
              className={`w-full py-3 rounded-xl mb-4 ${
                otp.join("").length < 6 ? "bg-gray-300" : "bg-orange-600"
              }`}
            >
              <Text className="text-white text-center font-semibold">
                Verify & Continue →
              </Text>
            </TouchableOpacity>

            {/* Resend & Change */}
            <TouchableOpacity className="mb-1">
              <Text className="text-orange-600 text-center">Resend OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity className="mb-4">
              <Text className="text-neutral-600 text-center">
                Change Details
              </Text>
            </TouchableOpacity>

            {/* Demo */}
            <View className="bg-orange-50 px-3 py-2 rounded-lg">
              <Text className="text-sm text-center text-neutral-700">
                Demo Mode: use any 6 digits
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
