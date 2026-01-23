import { View, Text, ScrollView, Image } from "react-native";
import { images } from "@/constants";

export default function Menu() {
  return (
    <ScrollView className="flex-1 bg-neutral-50 px-4 pt-6">
      <Text className="text-lg font-bold mb-4">Menu Items</Text>

      <View className="bg-white rounded-2xl p-4 mb-3 flex-row gap-3">
        <Image source={images.food} className="w-16 h-16 rounded-xl" />
        <View>
          <Text className="font-semibold">Margherita Pizza</Text>
          <Text className="text-sm text-gray-500">Rs 299</Text>
        </View>
      </View>
    </ScrollView>
  );
}
