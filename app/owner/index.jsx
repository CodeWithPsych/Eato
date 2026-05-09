import { images } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { loginOwnerAsync, selectOwnerAuthStatus, selectOwnerError } from "@/services/ownerSlice";

export default function OwnerSignin() {
  const dispatch   = useDispatch();
  const authStatus = useSelector(selectOwnerAuthStatus);
  const authError  = useSelector(selectOwnerError);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    const result = await dispatch(loginOwnerAsync({ email: email.trim(), password }));
    if (loginOwnerAsync.fulfilled.match(result)) {
      router.replace("/owner/(tabs)/dashboard");
    }
  };

  const isLoading = authStatus === "loading";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gradient-to-br from-purple-50 to-indigo-50"
    >
      {/* Header */}
      <SafeAreaView className="bg-white shadow-sm">
        <View className="flex-row items-center py-4 px-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={images.arrowBack} className="w-6 h-6" tintColor="#374151" />
          </TouchableOpacity>
          <View className="flex-row items-center gap-2 ml-3">
            <Image source={images.user2} className="w-5 h-5" tintColor="#7C3AED" />
            <Text className="text-lg font-quicksand-semibold text-neutral-800">Owner Login</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Card */}
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full bg-white rounded-3xl shadow-xl p-8">
          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center self-center mb-6">
            <Image source={images.user2} className="w-10 h-10" tintColor="#7C3AED" />
          </View>

          <Text className="text-center text-neutral-800 font-quicksand-bold mb-1">
            Restaurant Owner
          </Text>
          <Text className="text-center text-sm font-quicksand-medium text-neutral-600 mb-6">
            Access your restaurant dashboard
          </Text>

          {/* Error message */}
          {authError ? (
            <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <Text className="text-red-600 text-sm text-center">{authError}</Text>
            </View>
          ) : null}

          {/* Email */}
          <View className="mb-4">
            <View className="relative justify-center">
              <Image
                source={images.user2}
                style={{ position: "absolute", left: 16, zIndex: 1, width: 20, height: 20 }}
                tintColor="#9CA3AF"
              />
              <TextInput
                placeholder="owner@restaurant.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl"
              />
            </View>
          </View>

          {/* Password */}
          <View className="mb-6">
            <View className="relative justify-center">
              <Image
                source={images.lock}
                style={{ position: "absolute", left: 16, zIndex: 1, width: 20, height: 20 }}
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

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`py-3 rounded-xl ${isLoading ? "bg-purple-400" : "bg-purple-600"}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-quicksand-semibold">
                Login to Dashboard
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/resturant")} className="mt-4">
            <Text className="text-center text-sm text-neutral-500 font-quicksand-medium">
              Don't have an account? Register restaurant
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}