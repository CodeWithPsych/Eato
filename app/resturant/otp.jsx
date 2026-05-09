import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { verifyOtp, resendOtp } from "@/services/ownerAuthApi";
import { useDispatch } from "react-redux";
import { getOwnerMeAsync } from "@/services/ownerSlice";

export default function OTPVerification() {
  const { ownerName, ownerEmail, ownerPhone } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
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

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      await verifyOtp(ownerEmail, code);
      // fetch owner profile to get restaurantId into redux
      await dispatch(getOwnerMeAsync());
      router.push({
        pathname: "/resturant/set_resturant",
        params: { ownerName, ownerEmail, ownerPhone },
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Verification failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await resendOtp(ownerEmail);
      setError("OTP resent successfully!");
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to resend OTP");
    } finally {
      setResending(false);
    }
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
              <Image
                source={images.envelope}
                className="w-8 h-8"
                tintColor="#ea580c"
              />
            </View>

            <Text className="text-lg font-quicksand-semibold text-neutral-800 mb-1">
              Verify OTP
            </Text>
            <Text className="text-center text-neutral-500 mb-1 font-quicksand-medium">
              Enter the 6-digit code sent to
            </Text>
            <Text className="text-orange-600 font-quicksand-semibold mb-1">
              {ownerEmail}
            </Text>
            <Text className="text-neutral-500 mb-6 font-quicksand-medium">
              {ownerPhone}
            </Text>

            {/* Error / success message */}
            {!!error && (
              <View
                className={`w-full px-4 py-2 rounded-xl mb-4 ${
                  error.includes("resent")
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <Text
                  className={`text-sm text-center ${
                    error.includes("resent") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {error}
                </Text>
              </View>
            )}

            {/* OTP inputs */}
            <View className="flex-row justify-between w-full mb-6">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputsRef.current[index] = ref)}
                  value={digit}
                  onChangeText={(val) => handleChange(val, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace")
                      handleBackspace(digit, index);
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  className={`w-12 h-12 border rounded-xl text-center text-lg ${
                    digit
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300"
                  }`}
                  style={{ textAlignVertical: "center", paddingVertical: 0 }}
                />
              ))}
            </View>

            {/* Verify */}
            <TouchableOpacity
              disabled={!isComplete || loading}
              onPress={handleVerify}
              className={`w-full py-3 rounded-xl mb-4 ${
                isComplete && !loading ? "bg-orange-600" : "bg-gray-300"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-quicksand-semibold">
                  Verify & Continue →
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResend}
              disabled={resending}
              className="mb-2"
            >
              {resending ? (
                <ActivityIndicator color="#ea580c" />
              ) : (
                <Text className="text-orange-600 text-center font-quicksand-medium">
                  Resend OTP
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-neutral-500 text-center font-quicksand-medium">
                Change Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}