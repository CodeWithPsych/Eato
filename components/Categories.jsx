
import { categories } from "@/constants";
import { FlatList, Text, View } from "react-native";
import CategoryCard from "./CategoryCard";

const CategoriesGrid = () => {
  const handlePress = (category) => {
    console.log("Selected Category:", category.name);
  };

  return (
    <View className="px-6 pt-6 pb-4">
      <Text className="text-neutral-800 mb-4 text-lg font-semibold">
        Categories
      </Text>

      <FlatList
        data={categories}
        numColumns={3}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <CategoryCard item={item} onPress={handlePress} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CategoriesGrid;
