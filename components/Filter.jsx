import cn from "clsx";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMenuByCategoryAsync,
  selectSelectedCategory,
  setCategory,
} from "@/services/customerSlice";

const Filter = ({ categories = [] }) => {
  const dispatch = useDispatch();
  const active = useSelector(selectSelectedCategory);

  // 🔥 Convert ["Pizza","Burger"] → [{id:"Pizza", name:"Pizza"}]
  const data = categories.map((cat) => ({
    id: cat,
    name: cat,
  }));
  console.log(data);

  const handlePress = (category) => {
    dispatch(setCategory(category));
    dispatch(fetchMenuByCategoryAsync(category));
  };

  return (
    <View className="pb-3">
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item.name)}
            className={cn(
              "px-4 py-2 rounded-full",
              active === item.name
                ? "bg-orange-600"
                : "bg-orange-50 border-2 border-orange-200",
            )}
          >
            <Text
              className={cn(
                "text-sm",
                active === item.name ? "text-white" : "text-neutral-700",
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
