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
import { SafeAreaView } from "react-native-safe-area-context";

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
      <SafeAreaView className="bg-white shadow-sm">
        <View className="flex-row items-center py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={images.back}
              className="w-6 h-6"
              tintColor="#374151"
            />
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            <Image
              source={images.user2}
              className="w-5 h-5"
              tintColor="#7C3AED"
            />
            <Text className="text-lg font-quicksand-semibold text-neutral-800 ">
              Owner Login
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Card */}
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full bg-white rounded-3xl shadow-xl p-8">
          {/* Top Icon */}
          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center self-center mb-6">
            <Image
              source={images.user2}
              className="w-10 h-10"
              tintColor="#7C3AED"
            />
          </View>

          <Text className="text-center text-neutral-800 font-quicksand-bold mb-1">
            Restaurant Owner
          </Text>
          <Text className="text-center text-sm font-quicksand-medium text-neutral-600 mb-6">
            Access your restaurant dashboard
          </Text>

          {/* Email */}
          <View className="mb-4">
            <View className="relative justify-center">
              <Image
                source={images.user2}
                style={{
                  position: "absolute",
                  left: 16,
                  zIndex: 1,
                  width: 20,
                  height: 20,
                }}
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
          </View>

          {/* Password */}
          <View className="mb-6">
            <View className="relative justify-center">
              <Image
                source={images.lock}
                style={{
                  position: "absolute",
                  left: 16,
                  zIndex: 1,
                  width: 20,
                  height: 20,
                }}
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
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-purple-600 py-3 rounded-xl"
          >
            <Text className="text-white text-center font-quicksand-semibold">
              Login to Dashboard
            </Text>
          </TouchableOpacity>

          <Text className="text-center text-xs text-neutral-500 mt-4 font-quicksand-semibold">
            Demo: Use any email and password
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
