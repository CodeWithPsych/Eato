import { Tabs } from "expo-router";
import { View, Text, Image } from "react-native";
import { images } from "@/constants";

const TabIcon = ({ icon, title, focused }) => (
  <View className="items-center justify-center pt-6">
    <Image
      source={icon}
      className="w-6 h-6 mb-1"
      style={{ tintColor: focused ? "#7C3AED" : "#6B7280" }}
    />
    <Text className={`text-[10px] font-semibold ${focused ? "text-purple-600" : "text-gray-500"}`}>
      {title}
    </Text>
  </View>
);

export default function OwnerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
        options={{ tabBarIcon: ({ focused }) => (
          <TabIcon icon={images.dashboard} title="Dashboard" focused={focused} />
        )}}
      />

      <Tabs.Screen
        name="orders"
        options={{ tabBarIcon: ({ focused }) => (
          <TabIcon icon={images.orders} title="Orders" focused={focused} />
        )}}
      />

      <Tabs.Screen
        name="menu"
        options={{ tabBarIcon: ({ focused }) => (
          <TabIcon icon={images.menu} title="Menu" focused={focused} />
        )}}
      />

      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => (
          <TabIcon icon={images.user} title="Profile" focused={focused} />
        )}}
      />
    </Tabs>
  );
}
