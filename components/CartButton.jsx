import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { router } from "expo-router"; // Import router
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CartButton = () => {
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <TouchableOpacity
      className="cart-btn"
      onPress={() => router.push("/customer/cart")} // Navigate to /cart
    >
      <Image
        source={images.cart}
        className="size-5"
        resizeMode="contain"
        style={{ tintColor: "#fff7ed" }}
      />

      {totalItems > 0 && (
        <View className="cart-badge">
          <Text className="small-bold text-white">{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartButton;
