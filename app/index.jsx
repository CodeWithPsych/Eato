import { images } from "@/constants";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllRestaurantsAsync,
  selectRestaurants,
  selectListStatus,
} from "@/services/restaurantSlice";

export default function Index() {
  const dispatch = useDispatch();
  const restaurants = useSelector(selectRestaurants);
  const listStatus = useSelector(selectListStatus);

  // How many tables each restaurant "owns" in demo mode
  // Table IDs are assigned sequentially across restaurants:
  //   res_001 → tables 1-8, res_002 → tables 9-16, etc.
  const TABLES_PER_RESTAURANT = 8;

  useEffect(() => {
    dispatch(fetchAllRestaurantsAsync());
  }, [dispatch]);

  /**
   * Determine which restaurant owns a given table number dynamically.
   * No restaurant IDs are hardcoded — it's purely index math.
   */
  const getRestaurantForTable = (tableNumber) => {
    if (!restaurants.length) return null;
    const idx = Math.floor((tableNumber - 1) / TABLES_PER_RESTAURANT);
    const clampedIdx = Math.min(idx, restaurants.length - 1);
    return restaurants[clampedIdx];
  };

  const handleScanTable = (tableNumber) => {
    const restaurant = getRestaurantForTable(tableNumber);
    if (!restaurant) return;
    router.push({
      pathname: "/customer/home",
      params: { table: tableNumber, restaurantId: restaurant.id },
    });
  };

  // Build demo buttons dynamically from loaded restaurants
  // First restaurant gets table 1, second gets table (TABLES_PER_RESTAURANT + 1), etc.
  const demoTables = restaurants.map((r, idx) => ({
    label: `Scan Table ${idx * TABLES_PER_RESTAURANT + 1} → ${r.name}`,
    tableNumber: idx * TABLES_PER_RESTAURANT + 1,
    restaurantId: r.id,
  }));

  const BUTTON_COLORS = [
    "bg-primary",
    "bg-red-600",
    "bg-teal-600",
    "bg-blue-600",
    "bg-indigo-600",
    "bg-pink-600",
    "bg-yellow-600",
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#FFF4EC] px-5">
      {/* Header */}
      <View className="flex-row justify-between items-center mt-4">
        <View>
          <Text className="text-primary text-xl font-quicksand-bold">Eato</Text>
          <Text className="text-gray-500 text-sm font-quicksand-semibold">
            Scan to order
          </Text>
        </View>

        <View className="flex-row gap-3">
          {/* Restaurant / signup icon */}
          <TouchableOpacity
            onPress={() => router.push("/resturant")}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
          >
            <Image
              source={images.restaurant}
              className="size-5"
              resizeMode="contain"
              tintColor="#ff4c1b"
            />
          </TouchableOpacity>

          {/* Chef / Kitchen icon */}
          <TouchableOpacity
            onPress={() => router.push("/chef")}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
          >
            <Image
              source={images.chef}
              className="size-5"
              resizeMode="contain"
              tintColor="#ff4c1b"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* QR Scanner UI */}
      <View className="flex-1 justify-center items-center">
        {/* Scanner frame */}
        <View className="w-72 h-72 relative items-center justify-center">
          <View className="absolute top-0 left-0 w-10 h-10 border-l-4 border-t-4 border-primary rounded-tl-3xl" />
          <View className="absolute top-0 right-0 w-10 h-10 border-r-4 border-t-4 border-primary rounded-tr-3xl" />
          <View className="absolute bottom-0 left-0 w-10 h-10 border-l-4 border-b-4 border-primary rounded-bl-3xl" />
          <View className="absolute bottom-0 right-0 w-10 h-10 border-r-4 border-b-4 border-primary rounded-br-3xl" />

          <View className="w-32 h-32 bg-white rounded-2xl items-center justify-center shadow-md">
            <Image
              source={images.qrcode}
              className="w-20 h-20"
              resizeMode="contain"
              tintColor="#ff4c1b"
            />
          </View>
        </View>

        <Text className="mt-8 text-lg font-quicksand-bold">
          Scan Table QR Code
        </Text>
        <Text className="text-gray-500 text-center mt-1">
          Point your camera at the QR code on your table{"\n"}to start ordering
        </Text>

        <Text className="mt-6 text-gray-400 text-sm">
          Demo Mode — tap to simulate scan
        </Text>

        {/* Dynamic demo buttons from API */}
        {listStatus === "loading" ? (
          <ActivityIndicator size="small" color="#ff4c1b" className="mt-6" />
        ) : (
          <View className="w-full mt-2">
            {demoTables.map((btn, idx) => (
              <TouchableOpacity
                key={btn.restaurantId}
                onPress={() => handleScanTable(btn.tableNumber)}
                className={`${BUTTON_COLORS[idx % BUTTON_COLORS.length]} w-full py-4 rounded-2xl mt-3`}
              >
                <Text className="text-white text-center font-quicksand-bold">
                  {btn.label}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Owner login — always visible */}
            <TouchableOpacity
              onPress={() => router.push("/owner")}
              className="bg-purple-600 w-full py-4 rounded-2xl mt-3"
            >
              <Text className="text-white text-center font-quicksand-bold">
                Owner Login
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text className="text-gray-400 text-xs mt-4 mb-6">
          WiFi authentication required
        </Text>
      </View>
    </SafeAreaView>
  );
}