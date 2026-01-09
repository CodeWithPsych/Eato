import { images } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RestaurantProfile() {
  const [restaurantName, setRestaurantName] = useState("");

  // Mock owner data (later will come from signup)
  const owner = {
    name: "arham",
    email: "arhammalik900@yahoo.com",
    phone: "9876543210",
  };

  return (
    <View className="flex-1 bg-orange-50 px-6 pt-6">

      {/* HEADER */}
      <View className="flex-row items-center mb-12">
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={images.arrowBack} className="w-6 h-6"  />
        </TouchableOpacity>

        <View className="flex-row items-center ml-5 gap-2">
          <Image source={images.restaurant} className="w-6 h-6" tintColor="#ea580c" />
          <Text className="text-lg font-quicksand-bold text-neutral-800">
            Restaurant Setup
          </Text>
        </View>
      </View>

      {/* PROGRESS */}
      <View className="flex-row items-center justify-center mb-6">
        <View className="w-8 h-8 bg-orange-600 rounded-full items-center justify-center">
          <Text className="text-white font-bold">1</Text>
        </View>
        <View className="w-12 h-1 bg-gray-300 mx-2" />
        <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center">
          <Text className="text-gray-500">2</Text>
        </View>
        <View className="w-12 h-1 bg-gray-300 mx-2" />
        <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center">
          <Text className="text-gray-500">3</Text>
        </View>
        <View className="w-12 h-1 bg-gray-300 mx-2" />
        <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center">
          <Text className="text-gray-500">4</Text>
        </View>
      </View>

      {/* OWNER VERIFIED CARD */}
      <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-8 h-8 bg-green-200 rounded-full items-center justify-center">
            <Text className="text-green-700 font-bold">✓</Text>
          </View>
          <Text className="text-green-700 font-semibold">
            Owner Verified
          </Text>
        </View>

        <Text className="text-neutral-700 text-sm">
          <Text className="font-semibold">Owner:</Text> {owner.name}
        </Text>
        <Text className="text-neutral-700 text-sm">
          <Text className="font-semibold">Email:</Text> {owner.email}
        </Text>
        <Text className="text-neutral-700 text-sm">
          <Text className="font-semibold">Phone:</Text> {owner.phone}
        </Text>
      </View>

      {/* RESTAURANT NAME */}
      <Text className="text-neutral-700 mb-2">
        Restaurant Name
      </Text>

      <TextInput
        value={restaurantName}
        onChangeText={setRestaurantName}
        placeholder="Enter restaurant name"
        className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6"
      />

      {/* BUTTON */}
      <TouchableOpacity
        disabled={!restaurantName.trim()}
        onPress={() => router.push("/resturant/set_categories")}
        className={`py-4 rounded-xl ${
          restaurantName ? "bg-orange-600" : "bg-gray-300"
        }`}
      >
        <Text className="text-white text-center font-bold">
          Continue to Categories
        </Text>
      </TouchableOpacity>

    </View>
  );
}
