import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function Orders() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

 const allOrders = [
  {
    id: "ORD001",
    table: 5,
    items: 2,
    total: 837,
    status: "served",
    time: "10:30 AM",
  },
  {
    id: "ORD002",
    table: 12,
    items: 2,
    total: 635,
    status: "served",
    time: "10:15 AM",
  },
  {
    id: "ORD003",
    table: 4,
    items: 1,
    total: 418,
    status: "served",
    time: "09:50 AM",
  },
  {
    id: "ORD004",
    table: 7,
    items: 3,
    total: 1120,
    status: "served",
    time: "09:30 AM",
  },
  {
    id: "ORD005",
    table: 9,
    items: 2,
    total: 560,
    status: "served",
    time: "09:15 AM",
  },
  {
    id: "ORD006",
    table: 2,
    items: 4,
    total: 1345,
    status: "served",
    time: "08:55 AM",
  },

  //  Pending (3)
  {
    id: "ORD007",
    table: 8,
    items: 3,
    total: 1130,
    status: "pending",
    time: "11:28 AM",
  },
  {
    id: "ORD008",
    table: 3,
    items: 1,
    total: 418,
    status: "pending",
    time: "11:29 AM",
  },
  {
    id: "ORD009",
    table: 15,
    items: 2,
    total: 469,
    status: "served",
    time: "11:35 AM",
  },
  {
    id: "ORD010",
    table: 6,
    items: 2,
    total: 720,
    status: "served",
    time: "08:30 AM",
  },
];


  const pendingCount = allOrders.filter(o => o.status === "pending").length;
  const servedCount = allOrders.filter(o => o.status === "served").length;
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);

  const filteredOrders = allOrders.filter(order => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `table ${order.table}`.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <ScrollView
      className="flex-1 bg-neutral-50 px-4 pt-6"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Summary Cards */}
      <View className="flex-row justify-between mb-5">
        <View className="bg-orange-100 rounded-xl p-4 w-[32%] items-center">
          <Text className="text-orange-600 text-xl font-bold">
            {pendingCount}
          </Text>
          <Text className="text-orange-700 text-xs">Pending</Text>
        </View>

        <View className="bg-green-100 rounded-xl p-4 w-[32%] items-center">
          <Text className="text-green-600 text-xl font-bold">
            {servedCount}
          </Text>
          <Text className="text-green-700 text-xs">Served</Text>
        </View>

        <View className="bg-purple-100 rounded-xl p-4 w-[32%] items-center">
          <Text className="text-purple-600 text-lg font-bold">
            Rs {totalRevenue}
          </Text>
          <Text className="text-purple-700 text-xs">Total</Text>
        </View>
      </View>

      {/* Search */}
      <TextInput
        placeholder="Search by order ID..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        className="bg-white rounded-xl px-4 py-3 mb-4 border border-neutral-200"
      />

      {/* Filters */}
      <View className="flex-row mb-5">
        {["all", "pending", "served"].map(status => (
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
      {filteredOrders.map(order => (
        <View
          key={order.id}
          className={`rounded-2xl mb-4 border-2 ${
            order.status === "pending"
              ? "border-orange-200 bg-orange-50"
              : "border-green-200 bg-green-50"
          }`}
        >
          {/* Header */}
          <TouchableOpacity
            onPress={() =>
              setExpandedOrder(
                expandedOrder === order.id ? null : order.id
              )
            }
            className="p-4"
          >
            <View className="flex-row justify-between items-center">
              <View>
                <View className="flex-row items-center gap-2">
                  <Text className="font-semibold">{order.id}</Text>
                  <Text
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "pending"
                        ? "bg-orange-200 text-orange-700"
                        : "bg-green-200 text-green-700"
                    }`}
                  >
                    {order.status}
                  </Text>
                </View>
                <Text className="text-sm text-neutral-600 mt-1">
                  Table {order.table} • {order.time}
                </Text>
              </View>

              <Text className="text-neutral-600">
                {expandedOrder === order.id ? "▲" : "▼"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Expanded */}
          {expandedOrder === order.id ? (
            <View className="px-4 pb-4 border-t border-neutral-200">
              <Text className="text-sm text-neutral-600 mb-2">
                {order.items} item(s)
              </Text>
              <Text className="text-purple-600 font-semibold">
                Total: Rs {order.total}
              </Text>
            </View>
          ) : (
            <View className="px-4 pb-4">
              <View className="flex-row justify-between">
                <Text className="text-sm text-neutral-600">
                  {order.items} item(s)
                </Text>
                <Text className="text-purple-600 font-semibold">
                  Rs {order.total}
                </Text>
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
