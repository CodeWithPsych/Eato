import { images } from "@/constants";
import { useEffect } from "react";
import { Image, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStatsAsync,
  fetchOwnerMenuAsync,
  selectDashboardStats,
  selectOwnerStatsStatus,
  selectOwnerMenu,
} from "@/services/ownerSlice";
import {
  fetchOrdersByRestaurantAsync,
  selectRestaurantOrders,
} from "@/services/orderSlice";

export default function OwnerDashboard() {
  const dispatch = useDispatch();
  const stats = useSelector(selectDashboardStats);
  const statsStatus = useSelector(selectOwnerStatsStatus);
  const menu = useSelector(selectOwnerMenu);
  const recentOrders = useSelector(selectRestaurantOrders);

  useEffect(() => {
    dispatch(fetchDashboardStatsAsync("res_001"));
    dispatch(fetchOwnerMenuAsync("res_001"));
    dispatch(fetchOrdersByRestaurantAsync("res_001"));
  }, [dispatch]);

  const isLoading = statsStatus === "loading";

  // Derive counts from live orders when stats haven't loaded yet
  const totalSales = stats?.totalRevenue ?? 0;
  const totalOrders = stats?.totalOrders ?? 0;
  const pendingOrders = stats?.pendingOrders ?? 0;
  const servedOrders = stats?.servedOrders ?? 0;
  const topSellingItems = stats?.topItems ?? [];

  // Show only last 4 orders for the "recent" panel
  const displayedOrders = [...recentOrders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  return (
    <ScrollView
      className="flex-1 bg-neutral-50 pt-6 pb-24"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {isLoading ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : (
        <>
          {/* Stats Cards */}
          <View className="mb-6 px-5">
            {/* First Row */}
            <View className="flex-row justify-between mb-4">
              {[
                {
                  label: "Total Sales",
                  value: `Rs ${totalSales.toLocaleString()}`,
                  bg: "bg-emerald-500",
                  sub: "Today's Revenue",
                  icon: images.dollar,
                },
                {
                  label: "Total Orders",
                  value: totalOrders,
                  sub: "Today's Orders",
                  bg: "bg-indigo-500",
                  icon: images.cart,
                },
              ].map((card, index) => (
                <View key={index} className={`w-[48%] ${card.bg} rounded-2xl p-4`}>
                  <View className="flex-row items-center gap-2 mb-2">
                    <Image source={card.icon} tintColor="white" className="w-5 h-5" />
                    <Text className="text-sm text-white opacity-90 font-quicksand-semibold">
                      {card.label}
                    </Text>
                  </View>
                  <Text className="text-2xl font-bold text-white">{card.value}</Text>
                  {card.sub && (
                    <Text className="text-sm text-white opacity-90 mt-1">{card.sub}</Text>
                  )}
                </View>
              ))}
            </View>

            {/* Second Row */}
            <View className="flex-row justify-between">
              {[
                {
                  label: "Pending",
                  value: pendingOrders,
                  sub: "Active orders",
                  bg: "bg-orange-500",
                  icon: images.clockTwo,
                },
                {
                  label: "Served",
                  value: servedOrders,
                  sub: "Completed today",
                  bg: "bg-purple-500",
                  icon: images.user2,
                },
              ].map((card, index) => (
                <View key={index} className={`w-[48%] ${card.bg} rounded-2xl p-4`}>
                  <View className="flex-row items-center gap-2 mb-2">
                    <Image source={card.icon} tintColor="white" className="w-5 h-5" />
                    <Text className="text-sm text-white opacity-90 font-quicksand-semibold">
                      {card.label}
                    </Text>
                  </View>
                  <Text className="text-2xl font-bold text-white">{card.value}</Text>
                  {card.sub && (
                    <Text className="text-sm text-white opacity-90 mt-1">{card.sub}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Top Selling Items */}
          <View className="bg-white rounded-2xl px-5 p-5 border border-neutral-100 mb-6">
            <View className="flex-row items-center gap-2 mb-4">
              <Image source={images.star} tintColor="#FACC15" className="w-5 h-5" />
              <Text className="text-lg font-quicksand-semibold text-neutral-800">
                Top Selling Items
              </Text>
            </View>

            {topSellingItems.length === 0 ? (
              <Text className="text-neutral-400 text-center py-4">No data yet</Text>
            ) : (
              topSellingItems.slice(0, 4).map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center gap-3 p-3 bg-neutral-50 rounded-xl mb-3"
                >
                  <View className="w-8 h-8 rounded-full bg-yellow-100 items-center justify-center">
                    <Text className="text-yellow-600 font-semibold">#{index + 1}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-neutral-800">{item.name}</Text>
                    <Text className="text-sm text-neutral-500">{item.sold} sold today</Text>
                  </View>
                  <Text className="text-purple-600 font-semibold">Rs {item.revenue}</Text>
                </View>
              ))
            )}
          </View>

          {/* Recent Orders */}
          <View className="bg-white rounded-2xl px-5 p-5 border border-neutral-100 mb-6">
            <View className="flex-row items-center gap-2 mb-4">
              <Image source={images.clockTwo} tintColor="black" className="w-5 h-5" />
              <Text className="text-lg font-quicksand-semibold text-neutral-800">
                Recent Orders
              </Text>
            </View>

            {displayedOrders.length === 0 ? (
              <Text className="text-neutral-400 text-center py-4">No recent orders</Text>
            ) : (
              displayedOrders.map((order) => (
                <View
                  key={order.orderId ?? order.id}
                  className="bg-white p-4 rounded-xl border border-neutral-100 mb-3"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <View>
                      <Text className="font-medium text-neutral-800">
                        {order.orderId ?? order.id}
                      </Text>
                      <Text className="text-sm text-neutral-500">
                        Table {order.tableNumber ?? "—"}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-purple-600 font-semibold">
                        Rs {order.totalAmount ?? order.total ?? 0}
                      </Text>
                      <Text
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "Delivered" || order.status === "served"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {order.status}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-neutral-500">{order.date ?? order.time}</Text>
                </View>
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}