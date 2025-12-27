import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";

export default function SetMenuItems() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({
    name: "",
    category: "",
    price: "",
  });

  const addItem = () => {
    if (!item.name || !item.category || !item.price) return;
    setItems([...items, { ...item, id: Date.now().toString() }]);
    setItem({ name: "", category: "", price: "" });
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <Text className="text-xl font-semibold mb-4 text-center">
        Menu Items
      </Text>

      <TextInput
        value={item.name}
        onChangeText={(t) => setItem({ ...item, name: t })}
        placeholder="Dish name"
        className="border rounded-xl bg-white px-4 py-3 mb-3"
      />

      <TextInput
        value={item.category}
        onChangeText={(t) => setItem({ ...item, category: t })}
        placeholder="Category"
        className="border rounded-xl bg-white px-4 py-3 mb-3"
      />

      <TextInput
        value={item.price}
        onChangeText={(t) => setItem({ ...item, price: t })}
        placeholder="Price"
        keyboardType="number-pad"
        className="border rounded-xl bg-white px-4 py-3 mb-3"
      />

      <TouchableOpacity
        onPress={addItem}
        className="bg-orange-600 py-3 rounded-xl mb-4"
      >
        <Text className="text-white text-center font-semibold">
          Add Item
        </Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-3 mb-2">
            <Text className="font-medium">{item.name}</Text>
            <Text className="text-gray-500">
              {item.category} · Rs {item.price}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        disabled={items.length === 0}
        onPress={() => router.push("/resturant/set_tables")}
        className="bg-orange-600 py-3 rounded-xl mt-4 disabled:bg-gray-300"
      >
        <Text className="text-white text-center font-semibold">
          Continue to Tables
        </Text>
      </TouchableOpacity>
    </View>
  );
}
