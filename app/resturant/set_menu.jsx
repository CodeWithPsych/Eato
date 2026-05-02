import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
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
import { useDispatch } from "react-redux";
import { addMenuItemAsync } from "@/services/ownerSlice";

export default function SetMenuItems() {
  const { restaurantId } = useLocalSearchParams();
  const dispatch = useDispatch();

  const [menuItems,      setMenuItems]      = useState([]);
  const [dish,           setDish]           = useState("");
  const [category,       setCategory]       = useState("");
  const [price,          setPrice]          = useState("");
  const [description,    setDescription]    = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [saving,         setSaving]         = useState(false);

  // These come from the categories set in the previous step
  // In a real app, fetch from redux/API — for now user types
  const [customCategories] = useState([
    "Fast Food", "Desi", "Chinese", "BBQ", "Drinks", "Desserts",
  ]);

  const addItem = () => {
    if (!dish || !category || !price) return;
    setMenuItems((prev) => [
      ...prev,
      { id: Date.now().toString(), dish, category, price, description },
    ]);
    setDish(""); setCategory(""); setPrice(""); setDescription("");
  };

  const removeItem = (id) => setMenuItems((prev) => prev.filter((i) => i.id !== id));

  const handleContinue = async () => {
    if (!menuItems.length || saving) return;
    setSaving(true);
    for (const item of menuItems) {
      await dispatch(addMenuItemAsync({
        restaurantId,
        item: {
          name:        item.dish,
          category:    item.category,
          price:       parseFloat(item.price),
          description: item.description,
          image:       "burgerOne",
          isAvailable: true,
        },
      }));
    }
    setSaving(false);
    router.push({ pathname: "/resturant/set_tables", params: { restaurantId } });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-orange-50 px-6 pt-6"
    >
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
        {[true, true, false, false].map((done, i) => (
          <View key={i} className="flex-row items-center">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                done ? "bg-green-500" : i === 2 ? "bg-orange-600" : "bg-gray-300"
              }`}
            >
              <Text className={done || i === 2 ? "text-white font-bold" : "text-gray-500"}>
                {i + 1}
              </Text>
            </View>
            {i < 3 && (
              <View className={`w-12 h-1 mx-2 ${done ? "bg-green-500" : "bg-gray-300"}`} />
            )}
          </View>
        ))}
      </View>

      <View className="flex-1">
        {/* Inputs */}
        <TextInput
          placeholder="Dish name"
          value={dish}
          onChangeText={setDish}
          className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-3"
        />

        <TouchableOpacity
          onPress={() => setShowCategories(true)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex-row justify-between items-center mb-3"
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
          className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-3"
        />

        <TextInput
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-4"
        />

        <TouchableOpacity onPress={addItem} className="bg-orange-600 py-4 rounded-xl mb-4">
          <Text className="text-white text-center font-quicksand-semibold">+ Add Menu Item</Text>
        </TouchableOpacity>

        {/* Added items list */}
        <FlatList
          data={menuItems}
          keyExtractor={(i) => i.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="bg-white border border-gray-200 rounded-xl p-4 mb-3 flex-row justify-between">
              <View>
                <Text className="text-neutral-800 font-quicksand-medium">{item.dish}</Text>
                <Text className="text-sm text-neutral-500">{item.category}</Text>
                <Text className="text-orange-600 mt-1">Rs {item.price}</Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Buttons */}
        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity onPress={() => router.back()} className="flex-1 bg-neutral-200 py-3 rounded-xl">
            <Text className="text-center text-neutral-700">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!menuItems.length || saving}
            onPress={handleContinue}
            className={`flex-1 py-3 rounded-xl ${
              !menuItems.length || saving ? "bg-neutral-300" : "bg-orange-600"
            }`}
          >
            <Text className="text-white text-center">
              {saving ? "Saving…" : "Continue to Tables"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category picker modal */}
      <Modal transparent visible={showCategories} animationType="fade">
        <TouchableOpacity
          onPress={() => setShowCategories(false)}
          className="flex-1 bg-black/30 justify-center px-10"
        >
          <View className="bg-white rounded-xl p-4">
            {customCategories.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => { setCategory(c); setShowCategories(false); }}
                className="py-3 border-b border-gray-100"
              >
                <Text className="text-neutral-800">{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}