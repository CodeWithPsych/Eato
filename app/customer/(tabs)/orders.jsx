import CustomHeader from "@/components/CustomHeader";
import { images } from "@/constants";
import {
  fetchOrdersByUserAsync,
  selectUserOrders,
  selectUserOrdersStatus,
} from "@/services/orderSlice";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const DEMO_USER_ID = "user_001";

const STATUS_MAP = {
  pending: { label: "Pending", icon: images.clock },
  Pending: { label: "Pending", icon: images.clock },
  accepted: { label: "Preparing", icon: images.clock },
  Preparing: { label: "Preparing", icon: images.clock },
  ready: { label: "Ready", icon: images.check },
  Ready: { label: "Ready", icon: images.check },
  Delivered: { label: "Delivered", icon: images.check },
  Cancelled: { label: "Cancelled", icon: images.trash },
};

const OrderCard = ({ order }) => {
  const meta = STATUS_MAP[order.status] ?? {
    label: order.status,
    icon: images.clock,
  };

  const subtotal = (order.items ?? []).reduce(
    (s, i) => s + Number(i?.price ?? 0) * Number(i?.quantity ?? 0),
    0,
  );

  const total = Number(order?.totalAmount ?? subtotal ?? 0);

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 border-2 border-gray-200">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-2">
          <Image source={meta.icon} className="size-5" resizeMode="contain" />
          <Text className="font-quicksand-bold text-dark-100">
            {meta.label}
          </Text>
        </View>
        <Text className="text-neutral-500 text-sm">
          {order.tableNumber
            ? `Table ${order.tableNumber}`
            : (order.orderId ?? order.id)}
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
              Rs{" "}
              {(Number(item?.price ?? 0) * Number(item?.quantity ?? 0)).toFixed(
                2,
              )}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View className="border-t border-gray-200 pt-2 gap-1">
        <View className="flex-row justify-between">
          <Text className="text-neutral-500">Subtotal</Text>
          <Text className="text-neutral-700">
            Rs {Number(subtotal).toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-neutral-500">GST</Text>
          <Text className="text-neutral-700">Rs 5.00</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="font-quicksand-bold text-dark-100">Total</Text>
          <Text className="font-quicksand-bold text-orange-500">
            Rs {Number(total).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};
const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const status = useSelector(selectUserOrdersStatus);

  useEffect(() => {
    dispatch(fetchOrdersByUserAsync(DEMO_USER_ID));
  }, [dispatch]);

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
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.orderId ?? item.id}
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
