import Categories from "@/components/Categories";
import FeaturedItems from "@/components/FeaturedItems";
import { images } from "@/constants";
import { useEffect } from "react";
import { FlatList, Image, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ correct import
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { useCartStore } from "@/store/cart.store";
import {
  fetchRestaurantDetailsAsync,
  fetchCategoriesAsync,
  fetchMenuByCategoryAsync,
  resetCustomer,
  selectRestaurantDetails,
  selectRestaurantStatus,
} from "@/services/customerSlice";

export default function Home() {
  const { table, restaurantId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const restaurantDetails = useSelector(selectRestaurantDetails);
  const restaurantStatus = useSelector(selectRestaurantStatus);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (!restaurantId) return;
    dispatch(resetCustomer());
    dispatch(fetchRestaurantDetailsAsync(restaurantId));
    dispatch(fetchCategoriesAsync(restaurantId));
    dispatch(fetchMenuByCategoryAsync({ restaurantId, category: "All" }));
  }, [dispatch, restaurantId]);

  const handleAddToCart = (item) => {
    addItem({
      id: item.id ?? item._id,
      name: item.title ?? item.name,
      price: item.price,
      image: item.image,
      customizations: [],
    });
  };

  const Header = () => (
    <View className="bg-primary px-6 pt-6 pb-4 rounded-br-full">
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

      {restaurantStatus === "loading" || !restaurantDetails ? (
        <ActivityIndicator color="white" className="mt-2" />
      ) : (
        <>
          <Text className="text-white text-xl font-quicksand-bold mt-1">
            {restaurantDetails.name}
          </Text>

          {restaurantDetails.rating ? (
            <View className="mt-2 flex-row gap-2 items-center">
              <Image source={images.star} className="size-5" tintColor="yellow" />
              <Text className="text-white/80">
                {restaurantDetails.rating}
                {restaurantDetails.reviewCount
                  ? ` (${restaurantDetails.reviewCount}+ reviews)`
                  : ""}
              </Text>
            </View>
          ) : null}

          {restaurantDetails.location ? (
            <View className="mt-1 flex-row gap-2 items-center">
              <Image
                source={images.location}
                className="size-4"
                resizeMode="contain"
                tintColor="rgba(255,255,255,0.7)"
              />
              <Text className="text-white/70 text-sm">
                {restaurantDetails.location}
              </Text>
            </View>
          ) : null}
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-orange-100">
      <FlatList
        data={[{ id: "content" }]}
        keyExtractor={(item) => item.id}
        renderItem={() => (
          <View>
            <Categories restaurantId={restaurantId} />
            <FeaturedItems
              restaurantId={restaurantId}
              onAddToCart={handleAddToCart}
            />
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