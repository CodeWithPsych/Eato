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

const normalize = (s = "") => s.toLowerCase();

export default function Orders() {
  const dispatch = useDispatch();
  const allOrders = useSelector(selectRestaurantOrders);
  const ordersStatus = useSelector(selectRestOrdersStatus);

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const load = () => dispatch(fetchOrdersByRestaurantAsync({ limit: 100 }));

  useEffect(() => {
    load();
  }, [dispatch]);

  const pendingCount = allOrders.filter(
    (o) => normalize(o.status) === "pending"
  ).length;

  const servedCount = allOrders.filter((o) =>
    ["delivered", "served", "ready"].includes(normalize(o.status))
  ).length;

  const totalRevenue = allOrders.reduce(
    (sum, o) => sum + (o.total ?? o.totalAmount ?? 0),
    0
  );

  const filteredOrders = allOrders.filter((order) => {
    const status = normalize(order.status);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "pending" && status === "pending") ||
      (filterStatus === "active" && ["accepted"].includes(status)) ||
      (filterStatus === "served" &&
        ["delivered", "served", "ready"].includes(status));

    const id = (order._id ?? order.orderId ?? order.id ?? "").toString().toLowerCase();
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

  if (ordersStatus === "loading" || ordersStatus === "idle") {
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
          <Text className="text-purple-600 text-lg font-bold">
            Rs {Number(totalRevenue).toLocaleString()}
          </Text>
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
      <View className="flex-row mb-5 flex-wrap gap-2">
        {["all", "pending", "active", "served"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilterStatus(f)}
            className={`px-4 py-2 rounded-full ${
              filterStatus === f
                ? f === "pending"
                  ? "bg-orange-600"
                  : f === "served"
                  ? "bg-green-600"
                  : f === "active"
                  ? "bg-blue-600"
                  : "bg-purple-600"
                : "bg-neutral-200"
            }`}
          >
            <Text
              className={`text-sm capitalize ${
                filterStatus === f ? "text-white" : "text-neutral-700"
              }`}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <View className="items-center py-16">
          <Text className="text-neutral-400 font-quicksand-medium">
            No orders found
          </Text>
        </View>
      ) : (
        filteredOrders.map((order) => {
          const oid = order._id ?? order.orderId ?? order.id;
          const statusNorm = normalize(order.status);
          const isServed = ["delivered", "served", "ready"].includes(statusNorm);
          const isPending = statusNorm === "pending";
          const isAccepted = statusNorm === "accepted";

          return (
            <View
              key={oid}
              className={`rounded-2xl mb-4 border-2 ${
                isServed
                  ? "border-green-200 bg-green-50"
                  : isPending
                  ? "border-orange-200 bg-orange-50"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              {/* Header */}
              <TouchableOpacity
                onPress={() =>
                  setExpandedOrder(expandedOrder === oid ? null : oid)
                }
                className="p-4"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <View className="flex-row items-center gap-2">
                      <Text className="font-semibold text-neutral-800">
                        #{oid?.toString().slice(-6)}
                      </Text>
                      <Text
                        className={`px-2 py-1 rounded-full text-xs ${
                          isServed
                            ? "bg-green-200 text-green-700"
                            : isPending
                            ? "bg-orange-200 text-orange-700"
                            : "bg-blue-200 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </Text>
                    </View>
                    <Text className="text-sm text-neutral-500 mt-1">
                      Table {order.tableNumber ?? "—"} •{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleTimeString()
                        : order.time ?? order.date ?? ""}
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
                        {item.quantity}× {item.name} — Rs{" "}
                        {(item.price * item.quantity).toFixed(2)}
                      </Text>
                    ))}
                  </View>
                  <Text className="text-purple-600 font-semibold">
                    Total: Rs {order.total ?? order.totalAmount ?? 0}
                  </Text>

                  {/* Owner actions */}
                  <View className="flex-row gap-2 mt-3">
                    {isPending && (
                      <>
                        <TouchableOpacity
                          onPress={() => handleStatusChange(oid, "accepted")}
                          className="flex-1 bg-green-600 py-2 rounded-xl"
                        >
                          <Text className="text-white text-center text-sm font-quicksand-semibold">
                            Accept
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleStatusChange(oid, "cancelled")}
                          className="flex-1 bg-red-100 py-2 rounded-xl"
                        >
                          <Text className="text-red-600 text-center text-sm font-quicksand-semibold">
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {isAccepted && (
                      <TouchableOpacity
                        onPress={() => handleStatusChange(oid, "served")}
                        className="flex-1 bg-purple-600 py-2 rounded-xl"
                      >
                        <Text className="text-white text-center text-sm font-quicksand-semibold">
                          Mark Served
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ) : (
                <View className="px-4 pb-4 flex-row justify-between">
                  <Text className="text-sm text-neutral-500">
                    {(order.items ?? []).length} item(s)
                  </Text>
                  <Text className="text-purple-600 font-semibold">
                    Rs {order.total ?? order.totalAmount ?? 0}
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