import CustomHeader from "@/components/CustomHeader";
import { images } from "@/constants";
import {
  fetchOrdersByUserAsync,
  selectUserOrders,
  selectUserOrdersStatus,
} from "@/services/orderSlice";
import { selectSession } from "@/services/customerSlice";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";

const STATUS_MAP = {
  pending:   { label: "Pending",   icon: images.clock },
  Pending:   { label: "Pending",   icon: images.clock },
  accepted:  { label: "Preparing", icon: images.clock },
  Preparing: { label: "Preparing", icon: images.clock },
  ready:     { label: "Ready",     icon: images.check },
  Ready:     { label: "Ready",     icon: images.check },
  served:    { label: "Served",    icon: images.check },
  Served:    { label: "Served",    icon: images.check },
  Delivered: { label: "Delivered", icon: images.check },
  rejected:  { label: "Rejected",  icon: images.trash },
  cancelled: { label: "Cancelled", icon: images.trash },
  Cancelled: { label: "Cancelled", icon: images.trash },
};

// Statuses where the order is "done" — hide from the list
const DONE_STATUSES = ["served", "Served", "delivered", "Delivered"];

// Statuses where ETA should NOT be shown
const NO_ETA_STATUSES = ["ready", "Ready", "served", "Served", "delivered", "Delivered"];

const OrderCard = ({ order }) => {
  const meta = STATUS_MAP[order.status] ?? {
    label: order.status,
    icon: images.clock,
  };

  const subtotal = (order.items ?? []).reduce(
    (s, i) => s + Number(i?.price ?? 0) * Number(i?.quantity ?? 0),
    0
  );

  const total = Number(order?.total ?? order?.totalAmount ?? subtotal ?? 0);
  const gst   = Number(order?.gst ?? 0);

  // Only show ETA when order is still being prepared (not ready/served)
  const showEta =
    order.eta &&
    !NO_ETA_STATUSES.includes(order.status);

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 border-2 border-gray-200">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-2">
          <Image source={meta.icon} className="size-5" resizeMode="contain" />
          <Text className="font-quicksand-bold text-dark-100">{meta.label}</Text>
        </View>
        <Text className="text-neutral-500 text-sm">
          {order.tableNumber
            ? `Table ${order.tableNumber}`
            : order._id?.slice(-6) ?? ""}
        </Text>
      </View>

      {/* Items */}
      <View className="mb-3 gap-1">
        {(order.items ?? []).map((item, i) => (
          <View key={i} className="flex-row justify-between">
            <Text className="text-neutral-700">
              {item.name} × {item.quantity}
            </Text>
            <Text className="text-neutral-700">
              Rs {(Number(item?.price ?? 0) * Number(item?.quantity ?? 0)).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View className="border-t border-gray-200 pt-2 gap-1">
        <View className="flex-row justify-between">
          <Text className="text-neutral-500">Subtotal</Text>
          <Text className="text-neutral-700">Rs {subtotal.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-neutral-500">GST (5%)</Text>
          <Text className="text-neutral-700">Rs {gst.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-quicksand-bold text-dark-100">Total</Text>
          <Text className="font-quicksand-bold text-orange-500">
            Rs {total.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* ETA — only while order is still being prepared */}
      {showEta && (
        <View className="mt-2 bg-orange-50 rounded-lg px-3 py-2">
          <Text className="text-orange-600 text-sm text-center">
            ⏱ Estimated time: {order.eta} min
          </Text>
        </View>
      )}
    </View>
  );
};

const Orders = () => {
  const dispatch = useDispatch();
  const allOrders   = useSelector(selectUserOrders);
  const status      = useSelector(selectUserOrdersStatus);
  const session     = useSelector(selectSession);
  const { table, restaurantId } = useLocalSearchParams();

  const resolvedRestaurantId = restaurantId;
  const resolvedTable =
    session?.tableNumber ?? (table ? parseInt(table, 10) : null);

  useEffect(() => {
    if (resolvedRestaurantId && resolvedTable) {
      dispatch(
        fetchOrdersByUserAsync({
          restaurantId: resolvedRestaurantId,
          tableNumber:  resolvedTable,
        })
      );
    }
  }, [dispatch, resolvedRestaurantId, resolvedTable]);

  // Hide served/delivered orders from the customer list
  const orders = allOrders.filter(
    (o) => !DONE_STATUSES.includes(o.status)
  );

  return (
    <SafeAreaView className="flex-1 bg-orange-100">
      <View className="flex-1 px-5 pt-5">
        <CustomHeader title="Your Orders" />

        {status === "loading" ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#ff4c1b" size="large" />
          </View>
        ) : orders.length === 0 ? (
          <View
            className="flex-1 justify-center items-center"
            style={{ marginTop: -80 }}
          >
            <Image
              source={images.emptyState}
              style={{ width: 200, height: 200, resizeMode: "contain" }}
            />
            <Text className="text-2xl font-quicksand-bold text-dark-100 mt-4">
              No Orders Yet
            </Text>
            <Text className="text-neutral-500 text-sm mt-2 text-center">
              Place an order from the menu to see it here
            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id ?? item.orderId ?? item.id}
            renderItem={({ item }) => <OrderCard order={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Orders;