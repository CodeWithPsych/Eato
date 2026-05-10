// ─── app/owner/(tabs)/_layout.jsx ────────────────────────────────────────────
import { images } from "@/constants";
import { router, Tabs } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { selectOwnerName } from "@/services/ownerSlice";
import { selectSelectedRestaurant } from "@/services/restaurantSlice";

const TabIcon = ({ icon, title, focused }) => (
  <View className="items-center justify-center pt-6">
    <Image
      source={icon}
      className="w-6 h-6 mb-1"
      style={{ tintColor: focused ? "#7C3AED" : "#6B7280" }}
    />
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      className={`text-[10px] font-semibold ${
        focused ? "text-purple-600" : "text-gray-500"
      }`}
    >
      {title}
    </Text>
  </View>
);

const OwnerHeader = () => {
  // Pull restaurant name from Redux — populated by getOwnerMeAsync / loginOwnerAsync
  // ownerSlice stores restaurantId; the restaurant name lives in restaurantSlice.selectedRestaurant
  // but ownerSlice also stores ownerName. For the restaurant name we read from ownerSlice's
  // selectedRestaurant via restaurantSlice, with a sensible fallback.
  const selectedRestaurant = useSelector(selectSelectedRestaurant);
  const ownerName = useSelector(selectOwnerName);

  // restaurantSlice.selectedRestaurant is populated when fetchRestaurantByIdAsync runs.
  // ownerDashboard also calls fetchDashboardStatsAsync which doesn't store the name here,
  // so we try selectedRestaurant.name first, then fall back to ownerName.
  const restaurantName = selectedRestaurant?.name ?? "My Restaurant";

  return (
    <View className="p-6 bg-purple-600 rounded-b-2xl">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={images.arrowBack}
              className="w-6 h-6"
              tintColor="white"
            />
          </TouchableOpacity>

          <View>
            <Text className="text-white text-lg font-quicksand-bold">
              Owner Dashboard
            </Text>
            <Text className="text-sm text-white opacity-90 font-quicksand-semibold">
              {restaurantName}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/owner/(tabs)/profile")}
          className="bg-purple-400 p-3 rounded-full"
        >
          <Image source={images.user2} className="w-6 h-6" tintColor="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function OwnerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <OwnerHeader />,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          position: "absolute",
          bottom: 20,
          marginHorizontal: 20,
          borderRadius: 50,
          backgroundColor: "#F5F3FF",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={images.dashboard}
              title="Dashboard"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={images.cart} title="Orders" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={images.menu} title="Menu" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={images.user} title="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}