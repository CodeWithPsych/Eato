import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { addCategoryAsync } from "@/services/ownerSlice";

export default function SetCategories() {
  const { restaurantId } = useLocalSearchParams();
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [name,  setName]  = useState("");
  const [emoji, setEmoji] = useState("🍽️");
  const [saving, setSaving] = useState(false);

  const addCategory = () => {
    if (!name.trim()) return;
    setCategories((prev) => [...prev, { id: Date.now().toString(), name, emoji }]);
    setName(""); setEmoji("🍽️");
  };

  const removeCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleContinue = async () => {
    if (!categories.length || saving) return;
    setSaving(true);
    // Save each category to the API
    for (const cat of categories) {
      await dispatch(addCategoryAsync({
        restaurantId,
        categoryName: `${cat.emoji} ${cat.name}`,
      }));
    }
    setSaving(false);
    router.push({ pathname: "/resturant/set_menu", params: { restaurantId } });
  };

  return (
    <View className="flex-1 bg-orange-50 px-6 pt-6">
      {/* Header */}
      <View className="flex-row items-center mb-12">
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={images.arrowBack} className="w-6 h-6" />
        </TouchableOpacity>
        <View className="flex-row items-center ml-5 gap-2">
          <Image source={images.restaurant} className="w-6 h-6" tintColor="#ea580c" />
          <Text className="text-lg font-quicksand-bold text-neutral-800">Restaurant Setup</Text>
        </View>
      </View>

      {/* Progress */}
      <View className="flex-row items-center justify-center mb-8">
        {[
          { step: 1, done: true  },
          { step: 2, done: false, active: true },
          { step: 3, done: false },
          { step: 4, done: false },
        ].map(({ step, done, active }, i) => (
          <View key={step} className="flex-row items-center">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                done ? "bg-green-500" : active ? "bg-orange-600" : "bg-gray-300"
              }`}
            >
              <Text className={done || active ? "text-white font-bold" : "text-gray-500"}>
                {step}
              </Text>
            </View>
            {i < 3 && (
              <View className={`w-12 h-1 mx-2 ${done ? "bg-green-500" : "bg-gray-300"}`} />
            )}
          </View>
        ))}
      </View>

      <View className="flex-1">
        {/* Add row */}
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

        {/* List */}
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
                <Image source={images.trash} className="w-5 h-5" tintColor="red" />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Buttons */}
        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity onPress={() => router.back()} className="flex-1 bg-neutral-200 py-3 rounded-xl">
            <Text className="text-center text-neutral-700">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!categories.length || saving}
            onPress={handleContinue}
            className={`flex-1 py-3 rounded-xl ${
              !categories.length || saving ? "bg-neutral-300" : "bg-orange-600"
            }`}
          >
            <Text className="text-white text-center">
              {saving ? "Saving…" : "Continue to Menu"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}