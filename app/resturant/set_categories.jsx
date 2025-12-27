import { useState } from "react";
import {images} from "@/constants"
import { View, Text, TextInput, TouchableOpacity, FlatList,Image } from "react-native";
import { router } from "expo-router";

export default function SetCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategories([...categories, { id: Date.now().toString(), name: newCategory }]);
    setNewCategory("");
  };

  const removeCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <View className="flex-1 bg-orange-50 px-6 py-6">
      {/* Progress bar */}
      <View className="flex-row justify-between mb-4">
        <View className="w-4 h-4 bg-green-500 rounded-full" />
        <View className="w-4 h-4 bg-orange-500 rounded-full" />
        <View className="w-4 h-4 bg-gray-200 rounded-full" />
        <View className="w-4 h-4 bg-gray-200 rounded-full" />
      </View>

      {/* Add category */}
      <View className="flex-row mb-4">
        <TextInput
          value={newCategory}
          onChangeText={setNewCategory}
          placeholder="Category name"
          className="flex-1 border border-gray-300 bg-white rounded-xl px-4 py-2 mr-2"
        />
        <TouchableOpacity onPress={addCategory} className="bg-orange-600 px-4 py-2 rounded-xl">
       <Image source={images.plus} className="w-8 h-8" />
        </TouchableOpacity>
      </View>

      {/* Category List */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center bg-white p-3 rounded-xl mb-2 border border-gray-200">
            <Text>{item.name}</Text>
            <TouchableOpacity onPress={() => removeCategory(item.id)}>
               <Image source={images.trash} className="w-8 h-8" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Buttons */}
      <View className="flex-row gap-3 mt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 bg-gray-300 py-3 rounded-xl"
        >
          <Text className="text-center text-neutral-700">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/resturant/set_menu")}
          disabled={categories.length === 0}
          className={`flex-1 py-3 rounded-xl ${
            categories.length === 0 ? "bg-gray-300" : "bg-orange-600"
          }`}
        >
          <Text className="text-white text-center">Continue to Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
