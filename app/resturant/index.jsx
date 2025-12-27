import { images } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [ownerData, setOwnerData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = () => {
    setError("");

    if (
      !ownerData.name ||
      !ownerData.email ||
      !ownerData.phone ||
      !ownerData.password ||
      !confirmPassword
    ) {
      setError("Please fill all fields");
      return;
    }

    if (ownerData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    alert("OTP sent!");
    router.push("/resturant/otp");
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-orange-50 to-red-50 p-6 pt-14">
      <View className="bg-white rounded-3xl shadow-xl p-8">
        {/* Icon */}
        <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center self-center mb-4">
          <Image source={images.restaurant} className="size-9" />
        </View>

        {/* Title */}
        <Text className="text-center text-neutral-800 text-lg font-semibold mb-2">
          Restaurant Owner Signup
        </Text>
        <Text className="text-center text-neutral-600 text-sm mb-6">
          Create your account to set up your restaurant
        </Text>

        {/* Full Name */}
        <View className="mb-4">
          <Text className="text-neutral-700 mb-1">Full Name *</Text>
          <View className="relative">
            <Image
              source={images.user}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-5 z-10"
              tintColor="black"
            />
            <TextInput
              value={ownerData.name}
              onChangeText={(text) =>
                setOwnerData({ ...ownerData, name: text })
              }
              placeholder="John Doe"
              className="pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl"
            />
          </View>
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-neutral-700 mb-1">Official Email *</Text>
          <View className="relative">
            <Image
              source={images.envelope}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-5 z-10"
              tintColor="black"
            />
            <TextInput
              value={ownerData.email}
              onChangeText={(text) =>
                setOwnerData({ ...ownerData, email: text })
              }
              placeholder="owner@restaurant.com"
              keyboardType="email-address"
              className="pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl"
            />
          </View>
        </View>

        {/* Phone */}
        <View className="mb-4">
          <Text className="text-neutral-700 mb-1">Phone Number *</Text>
          <View className="relative">
            <Image
              source={images.phone}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-5 z-10"
              tintColor="black"
            />
            <TextInput
              value={ownerData.phone}
              onChangeText={(text) =>
                setOwnerData({ ...ownerData, phone: text })
              }
              placeholder="9876543210"
              keyboardType="number-pad"
              maxLength={10}
              className="pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl"
            />
          </View>
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="text-neutral-700 mb-1">Password *</Text>
          <View className="relative">
            <Image
              source={images.lock}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-5 z-10"
              tintColor="black"
            />
            <TextInput
              value={ownerData.password}
              onChangeText={(text) =>
                setOwnerData({ ...ownerData, password: text })
              }
              placeholder="Create a strong password"
              secureTextEntry={!showPassword}
              className="pl-10 pr-10 py-3 bg-neutral-50 border border-neutral-200 rounded-xl"
            />
            <TouchableOpacity
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Image
                source={showPassword ? images.hide : images.visible}
                className="size-5"
                tintColor="black"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password */}
        <View className="mb-4">
          <Text className="text-neutral-700 mb-1">Confirm Password *</Text>
          <View className="relative">
            <Image
              source={images.lock}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-5 z-10"
              tintColor="black"
            />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter your password"
              secureTextEntry={!showPassword}
              className="pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl"
            />
          </View>
        </View>

        {/* Error */}
        {error ? (
          <Text className="text-red-600 text-center mb-4">{error}</Text>
        ) : null}

        {/* Button */}
        <TouchableOpacity
          onPress={handleSendOTP}
          className="bg-orange-600 py-3 rounded-xl mb-2 flex-row justify-center items-center gap-2"
        >
          <Text className="text-white font-semibold">Send OTP</Text>
          <Image source={images.ArrowRight} className="size-5" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} className="py-3">
          <Text className="text-center text-neutral-600">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
