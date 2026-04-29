import { useEffect } from "react";
import { Text, View, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrdersByUserAsync,
  selectUserOrders,
  selectUserOrdersStatus,
} from "@/services/orderSlice";
import { images } from "@/constants";
import CustomHeader from "@/components/CustomHeader";

const DEMO_USER_ID = "user_001";

const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const status = useSelector(selectUserOrdersStatus);

  useEffect(() => {
    dispatch(fetchOrdersByUserAsync(DEMO_USER_ID));
  }, [dispatch]);

  const renderOrder = ({ item: order }) => {
    const statusIcon =
      order.status === "Pending"
        ? images.clock
        : order.status === "accepted" || order.status === "Preparing"
        ? images.clock
        : images.check;

    const statusText =
      order.status === "Pending"
        ? "Pending"
        : order.status === "accepted" || order.status === "Preparing"
        ? "Preparing"
        : order.status === "ready" || order.status === "Ready"
        ? "Ready"
        : order.status === "Delivered"
        ? "Delivered"
        : order.status;

    const subtotal = (order.items ?? []).reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const total = order.totalAmount ?? subtotal + 4.5;

    return (
      <View className="bg-white rounded-2xl p-4 mb-4 border-2 border-gray-200">
        <View className="flex-between flex-row mb-2">
          <View className="flex-row items-center gap-2">
            <Image source={statusIcon} className="size-5" resizeMode="contain" />
            <Text className="font-quicksand-bold text-dark-100">{statusText}</Text>
          </View>
          <Text className="text-dark-100">
            {order.tableNumber ? `Table ${order.tableNumber}` : order.orderId ?? order.id}
          </Text>
        </View>

        {/* Order Items */}
        <View className="mb-2">
          {(order.items ?? []).map((item, index) => (
            <View key={index} className="flex-row justify-between items-center mb-1">
              <Text className="text-dark-100">
                {item.name} x{item.quantity}
              </Text>
              <Text className="text-dark-100">Rs {item.price * item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Order Total */}
        <View className="border-t border-gray-200 pt-2">
          <View className="flex-row justify-between mb-1">
            <Text className="text-dark-100">Subtotal</Text>
            <Text className="text-dark-100">Rs {subtotal.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-dark-100">GST</Text>
            <Text className="text-dark-100">Rs 4.50</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-quicksand-bold text-dark-100">Total</Text>
            <Text className="font-quicksand-bold text-orange-500">
              Rs {total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-100">
      <View className="flex-1 px-5 pt-5">
        <CustomHeader title="Your Orders" />

        {status === "loading" ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-neutral-500 font-quicksand-medium">Loading orders…</Text>
          </View>
        ) : orders.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center", top: -130 }}
          >
            <Image
              source={images.emptyState}
              style={{ width: 200, height: 200, resizeMode: "contain" }}
            />
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#333" }}>
              No Orders Yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.orderId ?? item.id}
            renderItem={renderOrder}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Orders;