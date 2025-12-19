import React from "react";
import { View, Text, FlatList } from "react-native";
import FeaturedItemCard from "./FeaturedItemCard";
import { offers } from "@/constants";

const FeaturedItems = ({ onAddToCart }) => {
  return (
    <View className="px-6 pb-6">
      <Text className="text-neutral-800 mb-4 text-lg font-quicksand-semibold">
        Featured Dishes
      </Text>

      <FlatList
        data={offers}
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
