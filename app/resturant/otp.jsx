import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
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
  const { ownerName, ownerEmail, ownerPhone } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleBackspace = (value, index) => {
    if (!value && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleVerify = () => {
    router.push({
      pathname: "/resturant/set_resturant",
      params: { ownerName, ownerEmail, ownerPhone },
    });
  };

  const isComplete = otp.join("").length === 6;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-orange-50"
      >
        <View className="flex-1 justify-center items-center px-6">
          <View className="w-full bg-white rounded-3xl p-6 shadow-lg items-center">
            {/* Icon */}
            <View className="w-16 h-16 rounded-full bg-orange-100 items-center justify-center mb-4">
              <Image source={images.envelope} className="w-8 h-8" tintColor="#ea580c" />
            </View>

            <Text className="text-lg font-quicksand-semibold text-neutral-800 mb-1">
              Verify OTP
            </Text>
            <Text className="text-center text-neutral-500 mb-1 font-quicksand-medium">
              Enter the 6-digit code sent to
            </Text>
            <Text className="text-orange-600 font-quicksand-semibold mb-1">{ownerEmail}</Text>
            <Text className="text-neutral-500 mb-6 font-quicksand-medium">{ownerPhone}</Text>

            {/* OTP inputs */}
            <View className="flex-row justify-between w-full mb-6">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputsRef.current[index] = ref)}
                  value={digit}
                  onChangeText={(val) => handleChange(val, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace") handleBackspace(digit, index);
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  className={`w-12 h-12 border rounded-xl text-center text-lg ${
                    digit ? "border-orange-500 bg-orange-50" : "border-gray-300"
                  }`}
                  style={{ textAlignVertical: "center", paddingVertical: 0 }}
                />
              ))}
            </View>

            {/* Verify */}
            <TouchableOpacity
              disabled={!isComplete}
              onPress={handleVerify}
              className={`w-full py-3 rounded-xl mb-4 ${isComplete ? "bg-orange-600" : "bg-gray-300"}`}
            >
              <Text className="text-white text-center font-quicksand-semibold">
                Verify & Continue →
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="mb-2">
              <Text className="text-orange-600 text-center font-quicksand-medium">Resend OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-neutral-500 text-center font-quicksand-medium">
                Change Details
              </Text>
            </TouchableOpacity>

            <View className="bg-orange-50 px-3 py-2 rounded-lg mt-4">
              <Text className="text-sm text-center text-neutral-600 font-quicksand-medium">
                Demo: use any 6 digits
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}