import { images } from "@/constants";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CartButton = () => {
  // Temporary static value for UI design
  const totalItems = 2;

  return (
   <TouchableOpacity 
      className="cart-btn" 
      onPress={() => router.push("/customer/cart")} 
    >
      <Image source={images.cart} tintColor={'white'} className="size-5" resizeMode="contain" />
      {totalItems > 0 && (
        <View className="cart-badge">
          <Text className="small-bold text-white">{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartButton;
