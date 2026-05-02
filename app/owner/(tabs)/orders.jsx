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
import { selectOwnerRestaurantId } from "@/services/ownerSlice";

const DEMO_RESTAURANT_ID = "res_001";

const normalize = (s = "") => s.toLowerCase();

export default function Orders() {
  const dispatch     = useDispatch();
  const restaurantId = useSelector(selectOwnerRestaurantId) ?? DEMO_RESTAURANT_ID;
  const allOrders    = useSelector(selectRestaurantOrders);
  const ordersStatus = useSelector(selectRestOrdersStatus);

  const [filterStatus,   setFilterStatus]   = useState("all");
  const [searchQuery,    setSearchQuery]     = useState("");
  const [expandedOrder,  setExpandedOrder]   = useState(null);

  useEffect(() => {
    dispatch(fetchOrdersByRestaurantAsync(restaurantId));
  }, [dispatch, restaurantId]);

  const pendingCount = allOrders.filter((o) =>
    normalize(o.status) === "pending"
  ).length;

  const servedCount = allOrders.filter((o) =>
    ["delivered", "served", "ready"].includes(normalize(o.status))
  ).length;

  const totalRevenue = allOrders.reduce(
    (sum, o) => sum + (o.totalAmount ?? o.total ?? 0), 0
  );

  const filteredOrders = allOrders.filter((order) => {
    const status = normalize(order.status);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "pending" && status === "pending") ||
      (filterStatus === "served" && ["delivered", "served", "ready"].includes(status));

    const id = (order.orderId ?? order.id ?? "").toLowerCase();
    const table = `table ${order.tableNumber ?? ""}`.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      id.includes(searchQuery.toLowerCase()) ||
      table.includes(searchQuery.toLowerCase());

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
      {/* Summary */}
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
        {["all", "pending", "served"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilterStatus(f)}
            className={`px-4 py-2 rounded-full mr-2 ${
              filterStatus === f
                ? f === "pending" ? "bg-orange-600"
                : f === "served"  ? "bg-green-600"
                : "bg-purple-600"
                : "bg-neutral-200"
            }`}
          >
            <Text className={`text-sm capitalize ${filterStatus === f ? "text-white" : "text-neutral-700"}`}>
              {f}
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
          const oid      = order.orderId ?? order.id;
          const isServed = ["delivered", "served", "ready"].includes(normalize(order.status));

          return (
            <View
              key={oid}
              className={`rounded-2xl mb-4 border-2 ${
                isServed ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"
              }`}
            >
              {/* Header */}
              <TouchableOpacity
                onPress={() => setExpandedOrder(expandedOrder === oid ? null : oid)}
                className="p-4"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <View className="flex-row items-center gap-2">
                      <Text className="font-semibold text-neutral-800">{oid}</Text>
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
                    <Text className="text-sm text-neutral-500 mt-1">
                      Table {order.tableNumber ?? "—"} • {order.time ?? order.date ?? ""}
                    </Text>
                  </View>
                  <Text className="text-neutral-500">
                    {expandedOrder === oid ? "▲" : "▼"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Expanded */}
              {expandedOrder === oid ? (
                <View className="px-4 pb-4 border-t border-neutral-200">
                  <View className="gap-1 mt-3 mb-2">
                    {(order.items ?? []).map((item, idx) => (
                      <Text key={idx} className="text-sm text-neutral-700">
                        {item.quantity}× {item.name} — Rs {item.price * item.quantity}
                      </Text>
                    ))}
                  </View>
                  <Text className="text-purple-600 font-semibold">
                    Total: Rs {order.totalAmount ?? order.total ?? 0}
                  </Text>

                  {!isServed && (
                    <View className="flex-row gap-2 mt-3">
                      <TouchableOpacity
                        onPress={() => handleStatusChange(oid, "Delivered")}
                        className="flex-1 bg-green-600 py-2 rounded-xl"
                      >
                        <Text className="text-white text-center text-sm font-quicksand-semibold">
                          Mark Delivered
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleStatusChange(oid, "Cancelled")}
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
                <View className="px-4 pb-4 flex-row justify-between">
                  <Text className="text-sm text-neutral-500">
                    {(order.items ?? []).length} item(s)
                  </Text>
                  <Text className="text-purple-600 font-semibold">
                    Rs {order.totalAmount ?? order.total ?? 0}
                  </Text>
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}