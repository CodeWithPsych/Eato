import CartButton from "@/components/CartButton";
import Filter from "@/components/Filter";
import MenuCart from "@/components/MenuCart";
import SearchBar from "@/components/SearchBar";
import cn from "clsx";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import {
  fetchCategoriesAsync,
  fetchMenuByCategoryAsync,
  selectCategories,
  selectMenu,
  selectSelectedCategory,
  selectMenuStatus,
  setCategory,
} from "@/services/customerSlice";

const Menu = () => {
  const dispatch = useDispatch();
  const { restaurantId } = useLocalSearchParams();

  const categories = useSelector(selectCategories);
  const menu = useSelector(selectMenu);
  const selectedCategory = useSelector(selectSelectedCategory);
  const menuStatus = useSelector(selectMenuStatus);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!restaurantId) return;
    dispatch(fetchCategoriesAsync(restaurantId));
    dispatch(fetchMenuByCategoryAsync({ restaurantId, category: "All" }));
  }, [dispatch, restaurantId]);

  const handleCategoryChange = (category) => {
    dispatch(setCategory(category));
    dispatch(fetchMenuByCategoryAsync({ restaurantId, category }));
  };

  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return menu;
    const q = searchQuery.toLowerCase();
    return menu.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
    );
  }, [menu, searchQuery]);

  return (
    <SafeAreaView className="bg-orange-100 h-full">
      <FlatList
        data={filteredMenu}
        renderItem={({ item, index }) => {
          const isLeftColumn = index % 2 === 0;
          return (
            <View
              className={cn(
                "flex-1 max-w-[48%]",
                !isLeftColumn ? "mt-10" : "mt-0"
              )}
            >
              <MenuCart item={item} />
            </View>
          );
        }}
        keyExtractor={(item) => (item._id ?? item.id ?? "").toString()}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-7 px-5 pb-32"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() =>
          menuStatus === "loading" ? (
            <View className="items-center py-16">
              <ActivityIndicator color="#ff4c1b" />
            </View>
          ) : (
            <View className="items-center py-16">
              <Text className="text-neutral-400 font-quicksand-medium">
                {searchQuery
                  ? "No items match your search"
                  : "No menu items available"}
              </Text>
            </View>
          )
        }
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
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

            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

            <Filter
              categories={categories}
              restaurantId={restaurantId}
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