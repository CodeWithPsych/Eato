import { useState } from "react";
import {images} from "@/constants"
import { View, Text, TextInput, TouchableOpacity, ScrollView ,Image} from "react-native";
import { router } from "expo-router";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");

  return (
    <ScrollView className="flex-1 bg-orange-50 px-6 py-12">
      <View className="bg-white rounded-3xl p-6 shadow-lg items-center">
        {/* Icon */}
        <View className="w-16 h-16 rounded-full bg-orange-100 items-center justify-center mb-4">
          <Image source={images.envelope} className="w-8 h-8" />
        </View>

        {/* Title & Info */}
        <Text className="text-lg font-semibold text-neutral-800 mb-1">Verify OTP</Text>
        <Text className="text-center text-neutral-500 mb-1">
          Enter the 6-digit code sent to
        </Text>
        <Text className="text-orange-600 mb-1">arhammalik900@yahoo.com</Text>
        <Text className="text-neutral-600 mb-6">9876543210</Text>

        {/* OTP Inputs */}
        <View className="flex-row justify-between w-full mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <TextInput
              key={i}
              value={otp[i] || ""}
              onChangeText={(val) => {
                const newOtp = otp.split("");
                newOtp[i] = val;
                setOtp(newOtp.join("").slice(0, 6));
              }}
              keyboardType="number-pad"
              maxLength={1}
              className="w-12 h-12 border border-gray-300 rounded-xl text-center text-lg"
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          disabled={otp.length < 6}
          onPress={() => router.push("/resturant/set_categories")}
          className={`w-full py-3 rounded-xl mb-4 ${
            otp.length < 6 ? "bg-gray-300" : "bg-orange-600"
          }`}
        >
          <Text className="text-white text-center font-semibold">Verify & Continue →</Text>
        </TouchableOpacity>

        {/* Resend & Change */}
        <TouchableOpacity className="mb-1">
          <Text className="text-orange-600 text-center">Resend OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mb-4">
          <Text className="text-neutral-600 text-center">Change Details</Text>
        </TouchableOpacity>

        {/* Demo */}
        <View className="bg-orange-50 px-3 py-2 rounded-lg">
          <Text className="text-sm text-center text-neutral-700">
            Demo Mode: Use OTP <Text className="font-bold">123456</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
