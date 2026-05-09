import CartItem from "@/components/CartItem";
import CustomAlert from "@/components/CustomAlert";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import { images } from "@/constants";
import { selectSession } from "@/services/customerSlice";
import { createOrderAsync, selectCreateStatus } from "@/services/orderSlice";
import { useCartStore } from "@/store/cart.store";
import cn from "clsx";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const GST_RATE = 0.05; // 5% — backend recalculates this; kept for UI display
const DISCOUNT = 0; // no client-side discount

const PaymentRow = ({ label, value, labelStyle, valueStyle }) => (
  <View className="flex-between flex-row my-1">
    <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
      {label}
    </Text>
    <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
      {value}
    </Text>
  </View>
);

const Cart = () => {
  const dispatch = useDispatch();
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const createStatus = useSelector(selectCreateStatus);
  const session = useSelector(selectSession); // from QR scan
  const { table, restaurantId } = useLocalSearchParams();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const gst = parseFloat((subtotal * GST_RATE).toFixed(2));
  const grandTotal = parseFloat((subtotal + gst - DISCOUNT).toFixed(2));

  const handleOrderNow = async () => {
    if (!items.length) return;

    // Resolve table/restaurant from either QR session or URL params
    const resolvedRestaurantId = session?.tableNumber
      ? restaurantId // came from URL params
      : (restaurantId ?? "res_001");
    const resolvedTable = session?.tableNumber
      ? session.tableNumber
      : table
        ? parseInt(table, 10)
        : 1;

    const result = await dispatch(
      createOrderAsync({
        restaurantId: resolvedRestaurantId,
        tableNumber: resolvedTable,
        customerId: session?.customerId ?? null,
        sessionTag: session?.sessionTag ?? null,
        items: items.map((i) => ({
          itemId: i.id ?? i._id,
          quantity: i.quantity,
          customizations: i.customizations ?? [],
        })),
        notes: "",
      }),
    );

    if (createOrderAsync.fulfilled.match(result)) {
      clearCart();
      setAlertMessage("🎉 Your order has been placed successfully!");
    } else {
      setAlertMessage(
        result.payload ?? "Something went wrong. Please try again.",
      );
    }
    setAlertVisible(true);
  };

  return (
    <SafeAreaView className="bg-orange-100 h-full">
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) =>
          `${item.id ?? item._id}-${JSON.stringify(item.customizations)}`
        }
        contentContainerClassName="pb-44 px-5 pt-5"
        ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center h-96">
            <Image
              source={images.emptyState}
              style={{ width: 200, height: 200, resizeMode: "contain" }}
            />
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#333" }}>
              Cart Empty
            </Text>
          </View>
        )}
        ListFooterComponent={() =>
          totalItems > 0 ? (
            <View className="gap-5">
              <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                <Text className="h3-bold text-dark-100 mb-5">
                  Payment Summary
                </Text>
                <PaymentRow
                  label={`Items (${totalItems})`}
                  value={`Rs ${subtotal.toFixed(2)}`}
                />
                <PaymentRow label="GST (5%)" value={`Rs ${gst.toFixed(2)}`} />
                <View className="border-t border-gray-300 my-2" />
                <PaymentRow
                  label="Total"
                  value={`Rs ${grandTotal.toFixed(2)}`}
                  labelStyle="base-bold !text-dark-100"
                  valueStyle="base-bold !text-dark-100"
                />
              </View>

              <CustomButton
                title={
                  createStatus === "loading" ? "Placing Order…" : "Order Now"
                }
                IsLoading={createStatus === "loading"}
                onPress={handleOrderNow}
              />
            </View>
          ) : null
        }
      />

      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message={alertMessage}
      />
    </SafeAreaView>
  );
};

export default Cart;
