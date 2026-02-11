import { images } from "@/constants";
import { Tabs } from "expo-router";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

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

const OwnerHeader = () => (
  <View className="p-6 bg-purple-600 rounded-b-2xl">
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-4">
        <TouchableOpacity onPress={() => Alert.alert("onBack pressed")}>
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
            The Golden Spoon
          </Text>
        </View>
      </View>
      <View className="bg-purple-400 p-3 rounded-full">
        <Image source={images.user2} className="w-6 h-6" tintColor="white" />
      </View>
    </View>
  </View>
);

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
