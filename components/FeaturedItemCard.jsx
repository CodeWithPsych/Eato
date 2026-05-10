import { View, Text, TouchableOpacity } from "react-native";
import FoodImage from "./FoodImage";

const FeaturedItemCard = ({ item, onAddToCart }) => {
  return (
    <View className="bg-orange-50 rounded-2xl shadow-sm border border-orange-200 overflow-hidden mb-4">
      <View className="flex-row gap-4">
        {/* Image / emoji / letter */}
        <View className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden">
          <FoodImage
            image={item.image}
            emoji={item.emoji}
            name={item.title ?? item.name ?? ""}
            className="w-28 h-28"
            imgClassName="w-full h-full"
          />
        </View>

        <View className="flex-1 p-4 pr-3 justify-between">
          <View>
            <View className="flex-row justify-between items-start gap-2">
              <Text className="text-neutral-800 text-base font-quicksand-semibold">
                {item.title}
              </Text>
              <Text className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs">
                Rs {item.price}
              </Text>
            </View>

            <Text
              className="text-neutral-600 text-sm mt-1"
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => onAddToCart(item)}
            className="mt-2 self-start px-4 py-1.5 bg-primary rounded-lg"
          >
            <Text className="text-white text-sm font-quicksand-medium">Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FeaturedItemCard;