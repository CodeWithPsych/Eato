import CartItem from "@/components/CartItem";
import CustomAlert from "@/components/CustomAlert";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { createOrderAsync, selectCreateStatus } from "@/services/orderSlice";
import cn from "clsx";
import { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";

const DEMO_USER_ID = "user_001";

const PaymentInfoStripe = ({ label, value, labelStyle, valueStyle }) => (
  <View className="flex-between flex-row my-1">
    <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>{label}</Text>
    <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>{value}</Text>
  </View>
);

const Cart = () => {
  const dispatch = useDispatch();
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const createStatus = useSelector(selectCreateStatus);
  const { table } = useLocalSearchParams();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleOrderNow = async () => {
    if (items.length === 0) return;

    const result = await dispatch(
      createOrderAsync({
        userId: DEMO_USER_ID,
        restaurantId: "res_001",
        tableNumber: table ? parseInt(table) : Math.floor(Math.random() * 10) + 1,
        items: items.map((i) => ({
          itemId: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        totalAmount: parseFloat((totalPrice + 5 - 0.5).toFixed(2)),
        paymentMethod: "Cash on Delivery",
      })
    );

    if (createOrderAsync.fulfilled.match(result)) {
      clearCart();
      setAlertMessage("🎉 Your order has been placed successfully!");
    } else {
      setAlertMessage("Something went wrong. Please try again.");
    }
    setAlertVisible(true);
  };

  return (
    <SafeAreaView className="bg-orange-100 h-full">
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-44 px-5 pt-5"
        ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
        ListEmptyComponent={() => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center", height: 400 }}
          >
            <Image
              source={images.emptyState}
              style={{ width: 200, height: 200, resizeMode: "contain" }}
            />
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#333" }}>Cart Empty</Text>
          </View>
        )}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View className="gap-5">
              <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                <Text className="h3-bold text-dark-100 mb-5">Payment Summary</Text>

                <PaymentInfoStripe
                  label={`Total Items (${totalItems})`}
                  value={`Rs: ${totalPrice.toFixed(2)}`}
                />
                <PaymentInfoStripe label="GST" value="Rs: 5.00" />
                <PaymentInfoStripe
                  label="Discount"
                  value="- Rs 0.50"
                  valueStyle="!text-success"
                />

                <View className="border-t border-gray-300 my-2" />

                <PaymentInfoStripe
                  label="Total"
                  value={`Rs: ${(totalPrice + 5 - 0.5).toFixed(2)}`}
                  labelStyle="base-bold !text-dark-100"
                  valueStyle="base-bold !text-dark-100 !text-right"
                />
              </View>

              <CustomButton
                title={createStatus === "loading" ? "Placing Order…" : "Order Now"}
                IsLoading={createStatus === "loading"}
                onPress={handleOrderNow}
              />
            </View>
          )
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