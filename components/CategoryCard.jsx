import { Pressable, Text, View } from "react-native";
import FoodImage from "./FoodImage";

const CategoryCard = ({ item, onPress }) => {
  return (
    <Pressable
      onPress={() => onPress(item)}
      className="flex-1 bg-orange-50 rounded-xl p-4 border mb-2 border-orange-200 shadow-sm active:scale-95"
    >
      <View className="w-14 h-14 mx-auto mb-2 rounded-full overflow-hidden">
        <FoodImage
          image={item.image}
          emoji={item.emoji}
          name={item.name}
          className="w-14 h-14"
          imgClassName="w-full h-full"
        />
      </View>

      <Text className="text-sm text-neutral-700 text-center font-quicksand-medium">
        {item.name}
      </Text>
    </Pressable>
  );
};

export default CategoryCard;