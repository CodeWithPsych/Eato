import { useState } from "react";
import CartItem from "@/components/CartItem";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import CustomAlert from "@/components/CustomAlert"; // Import CustomAlert
import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { useOrdersStore } from "@/store/orders.store";
import cn from "clsx";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentInfoStripe = ({ label, value, labelStyle, valueStyle }) => (
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
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { addOrder } = useOrdersStore();
  const [alertVisible, setAlertVisible] = useState(false); // Alert state

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleOrderNow = () => {
    if (items.length === 0) return;

    const newOrder = {
      id: Date.now().toString(),
      tableNumber: Math.floor(Math.random() * 10) + 1,
      items: [...items],
      subtotal: totalPrice,
      gst: 0,
      total: totalPrice + 5 - 0.5,
      status: "pending",
    };

    addOrder(newOrder);
    clearCart();

    setAlertVisible(true); // Show custom alert
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
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: 400,
            }}
          >
            <Image
              source={images.emptyState} 
              style={{
                width: 200, 
                height: 200, 
                resizeMode: "contain",
              }}
            />
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#333" }}>
              Cart Empty
            </Text>
          </View>
        )}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View className="gap-5">
              <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                <Text className="h3-bold text-dark-100 mb-5">
                  Payment Summary
                </Text>

                <PaymentInfoStripe
                  label={`Total Items (${totalItems})`}
                  value={`Rs: ${totalPrice.toFixed(2)}`}
                />

                <PaymentInfoStripe label="Delivery Fee" value="Rs: 5.00" />

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

              <CustomButton title="Order Now" onPress={handleOrderNow} />
            </View>
          )
        }
      />

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message="🎉 Your order has been placed successfully!"
      />
    </SafeAreaView>
  );
};

export default Cart;
