import {
  fetchMenuByCategoryAsync,
  selectMenu,
  selectMenuStatus,
} from "@/services/customerSlice";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FeaturedItemCard from "./FeaturedItemCard";

const FeaturedItems = ({ restaurantId, onAddToCart }) => {
  const dispatch = useDispatch();
  const menu = useSelector(selectMenu);
  const menuStatus = useSelector(selectMenuStatus);

  useEffect(() => {
    if (!restaurantId) return;
    dispatch(fetchMenuByCategoryAsync({ restaurantId, category: "All" }));
  }, [dispatch, restaurantId]);

  const featured = menu.filter((i) => i.isAvailable !== false).slice(0, 4);

  if (menuStatus === "loading") {
    return (
      <View className="px-6 pb-6 items-center py-8">
        <ActivityIndicator color="#ff4c1b" />
      </View>
    );
  }

  if (!featured.length) return null;

  const normalisedItems = featured.map((item) => ({
    ...item,
    id: item._id ?? item.id ?? Math.random().toString(),
    title: item.name,
    // image is now a Cloudinary URL (string) — FoodImage handles it
    // emoji is passed through if present
    description: item.description ?? item.category ?? "",
  }));

  return (
    <View className="px-6 pb-6">
      <Text className="text-neutral-800 mb-4 text-lg font-quicksand-semibold">
        Featured Dishes
      </Text>

      <FlatList
        data={normalisedItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FeaturedItemCard item={item} onAddToCart={onAddToCart} />
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

export default FeaturedItems;