import { View, Text, Image, TouchableOpacity } from "react-native";

const FeaturedItemCard = ({ item, onAddToCart }) => {
  return (
    <View className="bg-neutral-50 rounded-2xl shadow-sm border border-neutral-100 overflow-hidden mb-4">
      <View className="flex-row gap-4">
        <View className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden">
          <Image
            source={item.image}
            className="w-full h-full"
            resizeMode="cover"
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
