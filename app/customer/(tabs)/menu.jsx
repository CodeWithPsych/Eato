import CartButton from "@/components/CartButton";
import Filter from "@/components/Filter";
import MenuCart from "@/components/MenuCart";
import SearchBar from "@/components/SearchBar";
import cn from "clsx";
import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCategoriesAsync,
  fetchMenuByCategoryAsync,
  selectCategories,
  selectMenu,
  selectSelectedCategory,
  setCategory,
} from "@/services/customerSlice";

const Menu = () => {
  const dispatch = useDispatch();

  // ✅ Redux state
  const categories = useSelector(selectCategories);
  const menu = useSelector(selectMenu);
  const selectedCategory = useSelector(selectSelectedCategory);

  // ✅ Load data on mount
  useEffect(() => {
    dispatch(fetchCategoriesAsync());
    dispatch(fetchMenuByCategoryAsync("All"));
  }, []);

  // ✅ Handle category change
  const handleCategoryChange = (category) => {
    dispatch(setCategory(category));
    dispatch(fetchMenuByCategoryAsync(category));
  };

  return (
    <SafeAreaView className="bg-orange-100 h-full">
      <FlatList
        data={menu}
        renderItem={({ item, index }) => {
          const isLeftColumn = index % 2 === 0;

          return (
            <View
              className={cn(
                "flex-1 max-w-[48%]",
                !isLeftColumn ? "mt-10" : "mt-0",
              )}
            >
              <MenuCart item={item} />
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-7 px-5 pb-32"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            {/* Header */}
            <View className="flex-between flex-row w-full">
              <View>
                <Text className="font-quicksand-bold text-xl uppercase text-primary">
                  Menu
                </Text>
                <Text className="font-quicksand-semibold text-dark-100 mt-2">
                  Find your favourite food
                </Text>
              </View>
              <CartButton />
            </View>

            <SearchBar />

            {/* ✅ Pass dynamic categories */}
            <Filter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Menu;
