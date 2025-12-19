import { Image, Pressable, Text, View } from "react-native";

const CategoryCard = ({ item, onPress }) => {
  return (
    <Pressable
      onPress={() => onPress(item)}
      className="flex-1 bg-white rounded-xl p-4 border mb-2 border-neutral-100 shadow-sm active:scale-95"
    >
      <View className="w-14 h-14 mx-auto mb-2 rounded-full bg-orange-100 items-center justify-center overflow-hidden">
        <Image
          source={item.image}
          resizeMode="contain"
          className="w-10 h-10"
        />
      </View>

      <Text className="text-sm text-neutral-700 text-center font-quicksand-medium">
        {item.name}
      </Text>
    </Pressable>
  );
};

export default CategoryCard;
