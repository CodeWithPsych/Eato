import Categories from "@/components/Categories";
import FeaturedItems from "@/components/FeaturedItems";
import { images } from "@/constants";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function Home() {
  const { table } = useLocalSearchParams();

  const handleAddToCart = (item) => {
    console.log("Added to cart:", item.title);
  };

  const Header = () => (
    <View className="bg-primary px-6 pt-6 pb-4 rounded-br-full">
      {/* Table number */}
      <View className="flex-row gap-2 items-center">
        <Image
          source={images.location}
          className="size-6"
          resizeMode="contain"
          tintColor="white"
        />
        <Text className="text-white font-quicksand-semibold">
          Table No {table}
        </Text>
      </View>

      {/* Restaurant Name */}
      <TouchableOpacity className="mt-1">
        <Text className="text-white text-xl font-quicksand-bold">
          The Golden Spoon
        </Text>
      </TouchableOpacity>

      {/* Rating */}
      <View className="mt-2 flex-row gap-2 items-center">
        <Image
          source={images.star}
          className="size-5"
          tintColor="yellow"
        />
        <Text className="text-white/80">
          4.5 (120+ reviews)
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-orange-100">
      <FlatList
        data={[{ id: "content" }]}
        keyExtractor={(item) => item.id}
        renderItem={() => (
          <View>
            <Categories />
            <FeaturedItems onAddToCart={handleAddToCart} />
          </View>
        )}
        ListHeaderComponent={Header}
        stickyHeaderIndices={[0]}
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
