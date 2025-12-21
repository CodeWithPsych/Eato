import cn from "clsx";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const Filter = ({ categories = [] }) => {
  const [active, setActive] = useState("all");

  const data = [{ id: "all", name: "All" }, ...categories];

  const handlePress = (id, name) => {
    setActive(id);
    console.log("Selected category:", { id, name });
  };

  return (
    <View className="pb-3">
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item.id, item.name)}
            className={cn(
              "px-4 py-2 rounded-full",
              active === item.id
                ? "bg-orange-600"
                : "bg-orange-50 border-2 border-orange-200 text-center"
            )}
          >
            <Text
              className={cn(
                "text-sm whitespace-nowrap",
                active === item.id
                  ? "text-white"
                  : "text-neutral-700"
              )}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Filter;
