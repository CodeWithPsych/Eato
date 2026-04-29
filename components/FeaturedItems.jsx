import { useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FeaturedItemCard from "./FeaturedItemCard";
import {
  fetchMenuByCategoryAsync,
  selectMenu,
  selectMenuStatus,
} from "@/services/customerSlice";
import { getImage } from "@/constants/getImage";


const FeaturedItems = ({ restaurantId = "res_001", onAddToCart }) => {
  const dispatch = useDispatch();
  const menu = useSelector(selectMenu);
  const menuStatus = useSelector(selectMenuStatus);

  useEffect(() => {
    // Only fetch if we don't already have data for this restaurant
    if (!menu.length) {
      dispatch(fetchMenuByCategoryAsync({ restaurantId, category: "All" }));
    }
  }, [dispatch, restaurantId]);

  // Take the first 4 available items as "featured"
  const featured = menu.filter((i) => i.isAvailable !== false).slice(0, 4);

  if (menuStatus === "loading") {
    return (
      <View className="px-6 pb-6 items-center py-8">
        <ActivityIndicator color="#ff4c1b" />
      </View>
    );
  }

  if (!featured.length) return null;

  // Normalise each item into the shape FeaturedItemCard expects:
  // { id, title, description, price, image (require source) }
  const normalisedItems = featured.map((item) => ({
    ...item,
    title: item.name,
    image: getImage(item.image),
    description: item.description ?? item.category ?? "",
  }));

  return (
    <View className="px-6 pb-6">
      <Text className="text-neutral-800 mb-4 text-lg font-quicksand-semibold">
        Featured Dishes
      </Text>

      <FlatList
        data={normalisedItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FeaturedItemCard item={item} onAddToCart={onAddToCart} />
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

export default FeaturedItems;