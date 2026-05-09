import { images } from "@/constants";
import {
  fetchAllRestaurantsAsync,
  selectListStatus,
  selectRestaurantError,
  selectRestaurants,
} from "@/services/restaurantSlice";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const BUTTON_COLORS = [
  "bg-primary",
  "bg-red-600",
  "bg-teal-600",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-pink-600",
  "bg-yellow-600",
];

export default function Index() {
  const dispatch = useDispatch();
  const restaurants = useSelector(selectRestaurants);
  const listStatus = useSelector(selectListStatus);
  const listError = useSelector(selectRestaurantError);

  useEffect(() => {
    dispatch(fetchAllRestaurantsAsync());
  }, [dispatch]);

  // One button per restaurant — always table 1 for demo
  const demoButtons = restaurants.map((r) => ({
    label: `Scan Table 1 — ${r.name}`,
    restaurantId: r._id ?? r.id,
    tableNumber: 1,
  }));

  const handleScanTable = ({ restaurantId, tableNumber }) => {
    if (!restaurantId) return;
    // ✅ Correct route: /customer/(tabs)/home
    router.push({
      pathname: "/customer/(tabs)/home",
      params: { table: tableNumber, restaurantId },
    });
  };

  const isLoading = listStatus === "idle" || listStatus === "loading";
  const isFailed = listStatus === "failed";

  return (
    <SafeAreaView className="flex-1 bg-[#FFF4EC]">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="px-5"
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mt-4">
          <View>
            <Text className="text-primary text-xl font-quicksand-bold">Eato</Text>
            <Text className="text-gray-500 text-sm font-quicksand-semibold">
              Scan to order
            </Text>
          </View>

          <View className="flex-row gap-3">
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

        {/* QR Scanner frame */}
        <View className="items-center mt-10">
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
        </View>

        {/* Buttons */}
        <View className="w-full mt-4 pb-8">
          {isLoading && (
            <View className="items-center py-6">
              <ActivityIndicator size="large" color="#ff4c1b" />
              <Text className="text-gray-400 text-sm mt-3 font-quicksand-medium">
                Connecting to server...
              </Text>
            </View>
          )}

          {isFailed && (
            <View className="items-center py-4 px-2">
              <Text className="text-red-500 text-sm text-center mb-3 font-quicksand-medium">
                {listError ?? "Could not reach the server. Please try again."}
              </Text>
              <TouchableOpacity
                onPress={() => dispatch(fetchAllRestaurantsAsync())}
                className="bg-primary px-8 py-3 rounded-2xl"
              >
                <Text className="text-white font-quicksand-bold">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {listStatus === "succeeded" &&
            demoButtons.map((btn, idx) => (
              <TouchableOpacity
                key={btn.restaurantId}
                onPress={() => handleScanTable(btn)}
                className={`${BUTTON_COLORS[idx % BUTTON_COLORS.length]} w-full py-4 rounded-2xl mt-3`}
              >
                <Text className="text-white text-center font-quicksand-bold">
                  {btn.label}
                </Text>
              </TouchableOpacity>
            ))}

          {!isLoading && (
            <TouchableOpacity
              onPress={() => router.push("/owner")}
              className="bg-purple-600 w-full py-4 rounded-2xl mt-3"
            >
              <Text className="text-white text-center font-quicksand-bold">
                Owner Login
              </Text>
            </TouchableOpacity>
          )}

          <Text className="text-gray-400 text-xs text-center mt-4">
            WiFi authentication required
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}