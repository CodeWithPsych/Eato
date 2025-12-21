import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useCartStore } from "@/store/cart.store";

const MenuCart = ({ item }) => {
  const { id, image, name, price } = item;
  const { addItem } = useCartStore();
  const [loading, setLoading] = useState(true);

  return (
    <TouchableOpacity
      className="bg-orange-50 rounded-2xl border-orange-200  p-4 items-center shadow-md w-40 h-44"
      style={Platform.OS === "android" ? { elevation: 5, shadowColor: "#000" } : {}}
      onPress={() => console.log("Card pressed:", name)}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color="#FE8C00"
          className="absolute top-10"
        />
      )}

      <Image
        source={image}
        className="size-36 absolute -top-16"
        resizeMode="contain"
        onLoadEnd={() => setLoading(false)}
      />

      <View className="absolute bottom-3 items-center">
        <Text className="text-center font-quicksand-bold text-base mb-1">
          {name}
        </Text>

        <Text className="text-gray-500">Rs {price}</Text>
        <TouchableOpacity
          onPress={() =>
            addItem({
              id,
              name,
              price,
              image,
              customizations: [], // keep your customizations empty
            })
          }
        >
          <Text className="text-orange-500 font-quicksand-bold text-sm mt-1">
            + Add to cart
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default MenuCart;
