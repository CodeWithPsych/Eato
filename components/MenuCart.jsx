import { useCartStore } from "@/store/cart.store";
import { Text, TouchableOpacity, View } from "react-native";
import FoodImage from "./FoodImage";

const MenuCart = ({ item }) => {
  const { addItem } = useCartStore();

  const handleAdd = () => {
    addItem({
      id: item._id ?? item.id,
      name: item.name,
      price: item.price,
      // Pass through the Cloudinary URL so the cart can display it
      image: item.image,
      emoji: item.emoji,
      customizations: [],
    });
  };

  return (
    <View className="bg-orange-50 rounded-3xl shadow-sm border border-orange-200 overflow-hidden">
      {/* Image / emoji / letter */}
      <View className="w-full h-36">
        <FoodImage
          image={item.image}
          emoji={item.emoji}
          name={item.name}
          className="w-full h-36"
          imgClassName="w-full h-full"
        />
      </View>

      {/* Info */}
      <View className="p-3">
        <Text
          className="text-neutral-800 font-quicksand-semibold text-sm"
          numberOfLines={1}
        >
          {item.name}
        </Text>

        {item.category ? (
          <Text className="text-neutral-400 text-xs mt-0.5" numberOfLines={1}>
            {item.category}
          </Text>
        ) : null}

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-primary font-quicksand-bold text-sm">
            Rs {item.price}
          </Text>

          <TouchableOpacity
            onPress={handleAdd}
            className="bg-primary w-7 h-7 rounded-full items-center justify-center"
          >
            <Text className="text-white font-bold text-base leading-none">+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MenuCart;