import { images } from "@/constants";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OwnerDashboard() {
  const todayStats = {
    totalSales: 15420,
    totalOrders: 47,
    pendingOrders: 3,
    servedOrders: 44,
  };

  const topSellingItems = [
    { name: "Margherita Pizza", sold: 12, revenue: 3588 },
    { name: "Chicken Shawarma", sold: 9, revenue: 1341 },
    { name: "Classic Beef Burger", sold: 8, revenue: 1592 },
    { name: "Loaded Cheese Fries", sold: 7, revenue: 903 },
  ];

  const recentOrders = [
    {
      id: "ORD001",
      table: 5,
      amount: 897,
      status: "served",
      time: "10 mins ago",
    },
    {
      id: "ORD002",
      table: 12,
      amount: 605,
      status: "served",
      time: "15 mins ago",
    },
    {
      id: "ORD003",
      table: 8,
      amount: 1245,
      status: "pending",
      time: "2 mins ago",
    },
    {
      id: "ORD004",
      table: 3,
      amount: 432,
      status: "pending",
      time: "Just now",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-neutral-50  pt-6 pb-24">
    

      {/* Stats Cards */}
      <View className="mb-6 px-5 ">
        {/* First Row */}
        <View className="flex-row justify-between mb-4">
          {[0, 1].map((index) => {
            const card = [
              {
                label: "Total Sales",
                value: `Rs ${todayStats.totalSales.toLocaleString()}`,
                bg: "bg-emerald-500",
                icon: images.dollar,
              },
              {
                label: "Total Orders",
                value: todayStats.totalOrders,
                bg: "bg-indigo-500",
                icon: images.bag,
              },
              {
                label: "Pending",
                value: todayStats.pendingOrders,
                sub: "Active orders",
                bg: "bg-orange-500",
                icon: images.clock,
              },
              {
                label: "Served",
                value: todayStats.servedOrders,
                sub: "Completed today",
                bg: "bg-purple-500",
                icon: images.user,
              },
            ][index];

            return (
              <View
                key={index}
                className={`w-[48%] ${card.bg} rounded-2xl p-4`}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <Image
                    source={card.icon}
                    tintColor="white"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-white opacity-90">
                    {card.label}
                  </Text>
                </View>
                <Text className="text-2xl font-bold text-white">
                  {card.value}
                </Text>
                {card.sub && (
                  <Text className="text-sm text-white opacity-90 mt-1">
                    {card.sub}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Second Row */}
        <View className="flex-row justify-between">
          {[2, 3].map((index) => {
            const card = [
              {
                label: "Total Sales",
                value: `Rs ${todayStats.totalSales.toLocaleString()}`,
                bg: "bg-emerald-500",
                icon: images.dollar,
              },
              {
                label: "Total Orders",
                value: todayStats.totalOrders,
                bg: "bg-indigo-500",
                icon: images.bag,
              },
              {
                label: "Pending",
                value: todayStats.pendingOrders,
                sub: "Active orders",
                bg: "bg-orange-500",
                icon: images.clock,
              },
              {
                label: "Served",
                value: todayStats.servedOrders,
                sub: "Completed today",
                bg: "bg-purple-500",
                icon: images.user,
              },
            ][index];

            return (
              <View
                key={index}
                className={`w-[48%] ${card.bg} rounded-2xl p-4`}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <Image
                    source={card.icon}
                    tintColor="white"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-white opacity-90">
                    {card.label}
                  </Text>
                </View>
                <Text className="text-2xl font-bold text-white">
                  {card.value}
                </Text>
                {card.sub && (
                  <Text className="text-sm text-white opacity-90 mt-1">
                    {card.sub}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Top Selling Items */}
      <View className="bg-white rounded-2xl px-5 p-5 border border-neutral-100 mb-6">
        <View className="flex-row items-center gap-2 mb-4">
          <Image source={images.star} tintColor="#FACC15" className="w-5 h-5" />
          <Text className="text-lg font-semibold text-neutral-800">
            Top Selling Items
          </Text>
        </View>

        {topSellingItems.map((item, index) => (
          <View
            key={index}
            className="flex-row items-center gap-3 p-3 bg-neutral-50 rounded-xl mb-3"
          >
            <View className="w-8 h-8 rounded-full bg-yellow-100 items-center justify-center">
              <Text className="text-yellow-600 font-semibold">
                #{index + 1}
              </Text>
            </View>

            <View className="flex-1">
              <Text className="font-medium text-neutral-800">{item.name}</Text>
              <Text className="text-sm text-neutral-500">
                {item.sold} sold today
              </Text>
            </View>

            <Text className="text-purple-600 font-semibold">
              Rs {item.revenue}
            </Text>
          </View>
        ))}
      </View>

      {/* Recent Orders */}
        <View className="bg-white rounded-2xl px-5 p-5 border border-neutral-100 mb-6">
        <View className="flex-row items-center gap-2 mb-4">
          <Image source={images.clock} tintColor="black" className="w-5 h-5" />
          <Text className="text-lg font-semibold text-neutral-800">
            Recent Orders
          </Text>
        </View>
        {recentOrders.map((order) => (
          <View
            key={order.id}
            className="bg-white p-4 rounded-xl border border-neutral-100 mb-3"
          >
            <View className="flex-row justify-between items-center mb-2">
              <View>
                <Text className="font-medium text-neutral-800">{order.id}</Text>
                <Text className="text-sm text-neutral-500">
                  Table {order.table}
                </Text>
              </View>

              <View className="items-end">
                <Text className="text-purple-600 font-semibold">
                  Rs {order.amount}
                </Text>
                <Text
                  className={`text-xs px-2 py-1 rounded-full ${
                    order.status === "served"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {order.status}
                </Text>
              </View>
            </View>
            <Text className="text-xs text-neutral-500">{order.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
