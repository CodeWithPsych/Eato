import { images } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OwnerSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) return;
    router.replace("/owner/(tabs)/dashboard");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gradient-to-br from-purple-50 to-indigo-50"
    >
      {/* Header */}
      <View className="flex-row items-center gap-4 px-6 pt-14 pb-4 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={images.back}
            className="w-6 h-6"
            tintColor="#374151"
          />
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          <Image
            source={images.user}
            className="w-5 h-5"
            tintColor="#7C3AED"
          />
          <Text className="text-lg font-semibold text-neutral-800">
            Owner Login
          </Text>
        </View>
      </View>

      {/* Card */}
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full bg-white rounded-3xl shadow-xl p-8">
          {/* Top Icon */}
          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center self-center mb-6">
            <Image
              source={images.user}
              className="w-10 h-10"
              tintColor="#7C3AED"
            />
          </View>

          <Text className="text-center text-neutral-800 font-semibold mb-1">
            Restaurant Owner
          </Text>
          <Text className="text-center text-sm text-neutral-600 mb-6">
            Access your restaurant dashboard
          </Text>

          {/* Email */}
          <Text className="text-neutral-700 mb-2">Email</Text>
          <View className="relative mb-4">
            <Image
              source={images.user}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              tintColor="#9CA3AF"
            />
            <TextInput
              placeholder="owner@restaurant.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              className="pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl"
            />
          </View>

          {/* Password */}
          <Text className="text-neutral-700 mb-2">Password</Text>
          <View className="relative mb-6">
            <Image
              source={images.lock}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              tintColor="#9CA3AF"
            />
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl"
            />
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-purple-600 py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              Login to Dashboard
            </Text>
          </TouchableOpacity>

          <Text className="text-center text-xs text-neutral-500 mt-4">
            Demo: Use any email and password
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
