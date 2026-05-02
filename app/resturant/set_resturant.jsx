import { images } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createRestaurantAsync, selectCreateStatus } from "@/services/restaurantSlice";
import { setOwnerRestaurantId } from "@/services/ownerSlice";
import { useLocalSearchParams } from "expo-router";

export default function RestaurantProfile() {
  const { ownerName, ownerEmail, ownerPhone } = useLocalSearchParams();
  const dispatch    = useDispatch();
  const createStatus = useSelector(selectCreateStatus);

  const [restaurantName, setRestaurantName] = useState("");

  const owner = {
    name:  ownerName  ?? "Owner",
    email: ownerEmail ?? "—",
    phone: ownerPhone ?? "—",
  };

  const handleContinue = async () => {
    if (!restaurantName.trim()) return;

    const result = await dispatch(
      createRestaurantAsync({
        name:       restaurantName.trim(),
        ownerName:  owner.name,
        ownerEmail: owner.email,
        ownerPhone: owner.phone,
        location:   "",
        categories: [],
        menu:       [],
        rating:     0,
      })
    );

    if (createRestaurantAsync.fulfilled.match(result)) {
      // Store the new restaurantId so all owner pages use it
      dispatch(setOwnerRestaurantId(result.payload.id));
      router.push({
        pathname: "/resturant/set_categories",
        params: { restaurantId: result.payload.id },
      });
    }
  };

  return (
    <View className="flex-1 bg-orange-50 px-6 pt-6">
      {/* Header */}
      <View className="flex-row items-center mb-12">
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={images.arrowBack} className="w-6 h-6" />
        </TouchableOpacity>
        <View className="flex-row items-center ml-5 gap-2">
          <Image source={images.restaurant} className="w-6 h-6" tintColor="#ea580c" />
          <Text className="text-lg font-quicksand-bold text-neutral-800">Restaurant Setup</Text>
        </View>
      </View>

      {/* Progress */}
      <View className="flex-row items-center justify-center mb-6">
        {[1, 2, 3, 4].map((step, i) => (
          <View key={step} className="flex-row items-center">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                step === 1 ? "bg-orange-600" : "bg-gray-300"
              }`}
            >
              <Text className={step === 1 ? "text-white font-bold" : "text-gray-500"}>
                {step}
              </Text>
            </View>
            {i < 3 && <View className="w-12 h-1 bg-gray-300 mx-2" />}
          </View>
        ))}
      </View>

      {/* Verified card */}
      <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-8 h-8 bg-green-200 rounded-full items-center justify-center">
            <Text className="text-green-700 font-bold">✓</Text>
          </View>
          <Text className="text-green-700 font-quicksand-semibold">Owner Verified</Text>
        </View>
        <Text className="text-neutral-700 text-sm">
          <Text className="font-quicksand-semibold">Owner: </Text>{owner.name}
        </Text>
        <Text className="text-neutral-700 text-sm">
          <Text className="font-quicksand-semibold">Email: </Text>{owner.email}
        </Text>
        <Text className="text-neutral-700 text-sm">
          <Text className="font-quicksand-semibold">Phone: </Text>{owner.phone}
        </Text>
      </View>

      {/* Restaurant name */}
      <Text className="text-neutral-700 mb-2">Restaurant Name</Text>
      <TextInput
        value={restaurantName}
        onChangeText={setRestaurantName}
        placeholder="Enter restaurant name"
        className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6"
      />

      <TouchableOpacity
        disabled={!restaurantName.trim() || createStatus === "loading"}
        onPress={handleContinue}
        className={`py-4 rounded-xl ${
          restaurantName.trim() && createStatus !== "loading"
            ? "bg-orange-600"
            : "bg-gray-300"
        }`}
      >
        {createStatus === "loading" ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-quicksand-bold">
            Continue to Categories
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}