import { images } from "@/constants";
import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

const TabBarIcon = ({ title, icon, focused }) => (
  <View
    style={{
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 35,
    }}
  >
    <Image
      source={icon}
      style={{
        width: 25,
        height: 25,
        marginBottom: 4,
        tintColor: focused ? "#FE8C00" : "#555555",
      }}
      resizeMode="contain"
    />
    <Text
      style={{
        fontSize: 10,
        fontWeight: "700",
        color: focused ? "#FE8C00" : "#555555",
      }}
    >
      {title}
    </Text>
  </View>
);


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginHorizontal: 20,
          height: 80,
          position: "absolute",
          bottom: 20,
          backgroundColor: "#f7dec2",
          shadowColor: "#1a1a1a",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Home" icon={images.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Menu" icon={images.menu} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Cart" icon={images.cart} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Orders" icon={images.clockTwo} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
