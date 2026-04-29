import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrdersByRestaurantAsync,
  updateOrderStatusAsync,
  selectRestaurantOrders,
  selectRestOrdersStatus,
} from "@/services/orderSlice";

export default function Orders() {
  const dispatch = useDispatch();
  const allOrders = useSelector(selectRestaurantOrders);
  const ordersStatus = useSelector(selectRestOrdersStatus);

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrdersByRestaurantAsync("res_001"));
  }, [dispatch]);

  const pendingCount = allOrders.filter(
    (o) => o.status === "Pending" || o.status === "pending"
  ).length;

  const servedCount = allOrders.filter(
    (o) => o.status === "Delivered" || o.status === "served" || o.status === "ready"
  ).length;

  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalAmount ?? o.total ?? 0), 0);

  const normaliseStatus = (s = "") => s.toLowerCase();

  const filteredOrders = allOrders.filter((order) => {
    const status = normaliseStatus(order.status);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "pending" && (status === "pending")) ||
      (filterStatus === "served" &&
        (status === "delivered" || status === "served" || status === "ready"));

    const id = order.orderId ?? order.id ?? "";
    const matchesSearch =
      id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `table ${order.tableNumber ?? ""}`.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatusAsync({ orderId, status: newStatus }));
  };

  if (ordersStatus === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-neutral-50 px-4 pt-6"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Summary Cards */}
      <View className="flex-row justify-between mb-5">
        <View className="bg-orange-100 rounded-xl p-4 w-[32%] items-center">
          <Text className="text-orange-600 text-xl font-bold">{pendingCount}</Text>
          <Text className="text-orange-700 text-xs">Pending</Text>
        </View>
        <View className="bg-green-100 rounded-xl p-4 w-[32%] items-center">
          <Text className="text-green-600 text-xl font-bold">{servedCount}</Text>
          <Text className="text-green-700 text-xs">Served</Text>
        </View>
        <View className="bg-purple-100 rounded-xl p-4 w-[32%] items-center">
          <Text className="text-purple-600 text-lg font-bold">Rs {totalRevenue}</Text>
          <Text className="text-purple-700 text-xs">Total</Text>
        </View>
      </View>

      {/* Search */}
      <TextInput
        placeholder="Search by order ID or table..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        className="bg-white rounded-xl px-4 py-3 mb-4 border border-neutral-200"
      />

      {/* Filters */}
      <View className="flex-row mb-5">
        {["all", "pending", "served"].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full mr-2 ${
              filterStatus === status
                ? status === "pending"
                  ? "bg-orange-600"
                  : status === "served"
                  ? "bg-green-600"
                  : "bg-purple-600"
                : "bg-neutral-200"
            }`}
          >
            <Text
              className={`text-sm ${
                filterStatus === status ? "text-white" : "text-neutral-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <View className="items-center py-16">
          <Text className="text-neutral-400 font-quicksand-medium">No orders found</Text>
        </View>
      ) : (
        filteredOrders.map((order) => {
          const orderId = order.orderId ?? order.id;
          const status = normaliseStatus(order.status);
          const isServed =
            status === "delivered" || status === "served" || status === "ready";

          return (
            <View
              key={orderId}
              className={`rounded-2xl mb-4 border-2 ${
                isServed
                  ? "border-green-200 bg-green-50"
                  : "border-orange-200 bg-orange-50"
              }`}
            >
              {/* Header row — tap to expand */}
              <TouchableOpacity
                onPress={() =>
                  setExpandedOrder(expandedOrder === orderId ? null : orderId)
                }
                className="p-4"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <View className="flex-row items-center gap-2">
                      <Text className="font-semibold">{orderId}</Text>
                      <Text
                        className={`px-2 py-1 rounded-full text-xs ${
                          isServed
                            ? "bg-green-200 text-green-700"
                            : "bg-orange-200 text-orange-700"
                        }`}
                      >
                        {order.status}
                      </Text>
                    </View>
                    <Text className="text-sm text-neutral-600 mt-1">
                      Table {order.tableNumber ?? "—"} •{" "}
                      {order.time ?? order.date ?? ""}
                    </Text>
                  </View>
                  <Text className="text-neutral-600">
                    {expandedOrder === orderId ? "▲" : "▼"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Expanded detail */}
              {expandedOrder === orderId ? (
                <View className="px-4 pb-4 border-t border-neutral-200">
                  {(order.items ?? []).map((item, idx) => (
                    <Text key={idx} className="text-sm text-neutral-700 mb-1">
                      {item.quantity}x {item.name} — Rs {item.price * item.quantity}
                    </Text>
                  ))}
                  <Text className="text-purple-600 font-semibold mt-2">
                    Total: Rs {order.totalAmount ?? order.total ?? 0}
                  </Text>

                  {/* Quick status actions */}
                  {!isServed && (
                    <View className="flex-row gap-2 mt-3">
                      <TouchableOpacity
                        onPress={() => handleStatusChange(orderId, "Delivered")}
                        className="flex-1 bg-green-600 py-2 rounded-xl"
                      >
                        <Text className="text-white text-center text-sm font-quicksand-semibold">
                          Mark Delivered
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleStatusChange(orderId, "Cancelled")}
                        className="flex-1 bg-red-100 py-2 rounded-xl"
                      >
                        <Text className="text-red-600 text-center text-sm font-quicksand-semibold">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ) : (
                <View className="px-4 pb-4">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-neutral-600">
                      {(order.items ?? []).length} item(s)
                    </Text>
                    <Text className="text-purple-600 font-semibold">
                      Rs {order.totalAmount ?? order.total ?? 0}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}