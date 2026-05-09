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

// Each restaurant owns this many sequential table numbers
const TABLES_PER_RESTAURANT = 8;

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

  const getRestaurantForTable = (tableNumber) => {
    if (!restaurants.length) return null;
    const idx = Math.min(
      Math.floor((tableNumber - 1) / TABLES_PER_RESTAURANT),
      restaurants.length - 1,
    );
    return restaurants[idx];
  };

  const handleScanTable = (tableNumber) => {
    const restaurant = getRestaurantForTable(tableNumber);
    if (!restaurant) return;
    router.push({
      pathname: "/customer/home",
      params: { table: tableNumber, restaurantId: restaurant.id },
    });
  };

const demoTables = restaurants.map((r, idx) => ({
  label: `Scan Table ${idx * TABLES_PER_RESTAURANT + 1}  ${r.name}`,
  tableNumber: idx * TABLES_PER_RESTAURANT + 1,
  restaurantId: r._id ?? r.id,   // ← add _id fallback
}));

  // Treat idle as loading — first render fires before fetch resolves
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
            <Text className="text-primary text-xl font-quicksand-bold">
              Eato
            </Text>
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
            Point your camera at the QR code on your table{"\n"}to start
            ordering
          </Text>
          <Text className="mt-6 text-gray-400 text-sm">
            Demo Mode — tap to simulate scan
          </Text>
        </View>

        {/* Buttons area */}
        <View className="w-full mt-4 pb-8">
          {/* Loading state */}
          {isLoading && (
            <View className="items-center py-6">
              <ActivityIndicator size="large" color="#ff4c1b" />
              <Text className="text-gray-400 text-sm mt-3 font-quicksand-medium">
                Connecting to server...
              </Text>
            </View>
          )}

          {/* Error state with retry */}
          {isFailed && (
            <View className="items-center py-4 px-2">
              <Text className="text-red-500 text-sm text-center mb-3 font-quicksand-medium">
                {listError ??
                  "Could not reach the server. Make sure json-server is running on port 3000."}
              </Text>
              <TouchableOpacity
                onPress={() => dispatch(fetchAllRestaurantsAsync())}
                className="bg-primary px-8 py-3 rounded-2xl"
              >
                <Text className="text-white font-quicksand-bold">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Success state — one button per restaurant */}
          {listStatus === "succeeded" &&
            demoTables.map((btn, idx) => (
              <TouchableOpacity
                key={String(btn.restaurantId)} 
                onPress={() => handleScanTable(btn.tableNumber)}
                className={`${BUTTON_COLORS[idx % BUTTON_COLORS.length]} w-full py-4 rounded-2xl mt-3`}
              >
                <Text className="text-white text-center font-quicksand-bold">
                  {btn.label}
                </Text>
              </TouchableOpacity>
            ))}

          {/* Owner login — shown once loading is done */}
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
