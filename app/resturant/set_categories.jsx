import { images } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SetCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🍽️");

  const addCategory = () => {
    if (!name.trim()) return;
    setCategories([...categories, { id: Date.now().toString(), name, emoji }]);
    setName("");
    setEmoji("🍽️");
  };

  const removeCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <View className="flex-1 bg-orange-50 px-6 pt-6">

      {/* HEADER (Figma style) */}
         <View className="flex-row items-center mb-12">
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={images.arrowBack} className="w-6 h-6"  />
        </TouchableOpacity>

        <View className="flex-row items-center ml-5 gap-2">
          <Image source={images.restaurant} className="w-6 h-6" tintColor="#ea580c" />
          <Text className="text-lg font-quicksand-bold text-neutral-800">
            Restaurant Setup
          </Text>
        </View>
      </View>

      {/* PROGRESS */}
       <View className="flex-row items-center justify-center mb-8">
        <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
          <Text className="text-white font-bold">1</Text>
        </View>
        <View className="w-12 h-1 bg-green-500 mx-2" />
        <View className="w-8 h-8 bg-orange-600 rounded-full items-center justify-center">
          <Text className="text-white font-bold">2</Text>
        </View>
        <View className="w-12 h-1 bg-gray-300 mx-2" />
        <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center">
          <Text className="text-gray-500">3</Text>
        </View>
        <View className="w-12 h-1 bg-gray-300 mx-2" />
        <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center">
          <Text className="text-gray-500">4</Text>
        </View>
      </View>

      {/* CONTENT */}
      <View className="flex-1">

        {/* Add category */}
        <View className="flex-row gap-2 mb-4">
          <TextInput
            value={emoji}
            onChangeText={setEmoji}
            placeholder="🍽️"
            className="w-16 text-xl text-center bg-white border border-neutral-200 rounded-xl"
          />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Category name"
            className="flex-1 bg-white border border-neutral-200 rounded-xl px-4"
          />
          <TouchableOpacity
            onPress={addCategory}
            className="bg-orange-600 w-12 rounded-xl items-center justify-center"
          >
            <Image source={images.plus} className="w-6 h-6" tintColor="white" />
          </TouchableOpacity>
        </View>

        {/* Category List */}
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between bg-white p-4 rounded-xl border border-neutral-200">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">{item.emoji}</Text>
                <Text className="text-neutral-800">{item.name}</Text>
              </View>
              <TouchableOpacity onPress={() => removeCategory(item.id)}>
                <Image
                  source={images.trash}
                  className="w-5 h-5"
                  tintColor="red"
                />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Buttons */}
        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-neutral-200 py-3 rounded-xl"
          >
            <Text className="text-center text-neutral-700">Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={categories.length === 0}
            onPress={() => router.push("/resturant/set_menu")}
            className={`flex-1 py-3 rounded-xl ${
              categories.length === 0 ? "bg-neutral-300" : "bg-orange-600"
            }`}
          >
            <Text className="text-white text-center">Continue to Menu</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
