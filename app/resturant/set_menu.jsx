import { images } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = ["Fast Food", "Desi", "Chinese", "BBQ", "Drinks", "Desserts"];

export default function SetMenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [dish, setDish] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  const addItem = () => {
    if (!dish || !category || !price) return;
    setMenuItems((prev) => [
      ...prev,
      { id: Date.now().toString(), dish, category, price, description },
    ]);
    setDish("");
    setCategory("");
    setPrice("");
    setDescription("");
  };

  const removeItem = (id) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-orange-50 px-6 pt-6"
    >

      {/* HEADER */}
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
        <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
          <Text className="text-white font-bold">2</Text>
        </View>
        <View className="w-12 h-1 bg-green-500 mx-2" />
        <View className="w-8 h-8 bg-orange-600 rounded-full items-center justify-center">
          <Text className="text-white font-bold">3</Text>
        </View>
        <View className="w-12 h-1 bg-gray-300 mx-2" />
        <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center">
          <Text className="text-gray-500">4</Text>
        </View>
      </View>

      {/* CONTENT */}
      <View className="flex-1">

        {/* Inputs */}
        <TextInput
          placeholder="Dish name"
          value={dish}
          onChangeText={setDish}
          className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-4"
        />

        <TouchableOpacity
          onPress={() => setShowCategories(true)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex-row justify-between items-center mb-4"
        >
          <Text className={category ? "text-black" : "text-gray-400"}>
            {category || "Select category"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#6b7280" />
        </TouchableOpacity>

        <TextInput
          placeholder="Price (Rs)"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-4"
        />

        <TextInput
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-6"
        />

        <TouchableOpacity
          onPress={addItem}
          className="bg-orange-600 py-4 rounded-xl mb-6"
        >
          <Text className="text-white text-center font-semibold">
            + Add Menu Item
          </Text>
        </TouchableOpacity>

        {/* Menu Items */}
        <FlatList
          data={menuItems}
          keyExtractor={(i) => i.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="bg-white border border-gray-200 rounded-xl p-4 mb-3 flex-row justify-between">
              <View>
                <Text className="text-neutral-800 font-medium">
                  {item.dish}
                </Text>
                <Text className="text-sm text-neutral-500">
                  {item.category}
                </Text>
                <Text className="text-orange-600 mt-1">
                  Rs {item.price}
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
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
            disabled={menuItems.length === 0}
            onPress={() => router.push("/resturant/set_tables")}
            className={`flex-1 py-3 rounded-xl ${
              menuItems.length === 0
                ? "bg-neutral-300"
                : "bg-orange-600"
            }`}
          >
            <Text className="text-white text-center">
              Continue to Tables
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Modal */}
      <Modal transparent visible={showCategories} animationType="fade">
        <TouchableOpacity
          onPress={() => setShowCategories(false)}
          className="flex-1 bg-black/30 justify-center px-10"
        >
          <View className="bg-white rounded-xl p-4">
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => {
                  setCategory(c);
                  setShowCategories(false);
                }}
                className="py-3 border-b border-gray-100"
              >
                <Text>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </KeyboardAvoidingView>
  );
}
