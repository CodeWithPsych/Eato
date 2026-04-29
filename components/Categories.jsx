import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CategoryCard from "./CategoryCard";
import {
  fetchCategoriesAsync,
  fetchMenuByCategoryAsync,
  selectCategories,
  setCategory,
} from "@/services/customerSlice";

const CategoriesGrid = ({ restaurantId = "res_001" }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchCategoriesAsync(restaurantId));
  }, [dispatch, restaurantId]);

  // Build cards from the string array the API returns
  const categoryCards = categories
    .filter((c) => c !== "All") // "All" is a UI-only filter, not a real category card
    .map((name, idx) => ({ id: String(idx), name }));

  const handlePress = (category) => {
    dispatch(setCategory(category.name));
    dispatch(fetchMenuByCategoryAsync({ restaurantId, category: category.name }));
  };

  if (!categoryCards.length) return null;

  return (
    <View className="px-6 pt-6 pb-4">
      <Text className="text-neutral-800 mb-4 text-lg font-quicksand-semibold">
        Categories
      </Text>

      <FlatList
        data={categoryCards}
        numColumns={3}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <CategoryCard item={item} onPress={handlePress} />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

export default CategoriesGrid;