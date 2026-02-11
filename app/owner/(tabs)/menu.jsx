import { CATEGORIES, images } from "@/constants";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const menuItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      category: "Pizza",
      description:
        "Classic pizza with fresh mozzarella, tomato sauce, and basil",
      price: 299,
      image: images.pizzaOne,
      featured: true,
    },
    {
      id: 2,
      name: "Chicken Burger",
      category: "Burger",
      description: "Crispy fried chicken with coleslaw and mayo",
      price: 179,
      image: images.burgerOne,
      featured: false,
    },
    {
      id: 3,
      name: "BBQ Burger",
      category: "Burger",
      description: "Grilled beef patty with BBQ sauce and onions",
      price: 249,
      image: images.burgerTwo,
      featured: true,
    },
    {
      id: 4,
      name: "Burrito Special",
      category: "Burrito",
      description: "Tortilla filled with beans, rice, and spicy chicken",
      price: 349,
      image: images.buritto,
      featured: false,
    },
    {
      id: 5,
      name: "Mozarella Sticks",
      category: "Snacks",
      description: "Golden fried cheese sticks served with dipping sauce",
      price: 199,
      image: images.mozarellaSticks,
      featured: true,
    },
    {
      id: 6,
      name: "Fries",
      category: "Snacks",
      description: "Crispy golden fries, perfect side for any meal",
      price: 99,
      image: images.fries,
      featured: false,
    },
    {
      id: 7,
      name: "Avocado Salad",
      category: "Salad",
      description: "Fresh avocado with cucumber and tomatoes",
      price: 249,
      image: images.avocado,
      featured: false,
    },
    {
      id: 8,
      name: "Chicken Wrap",
      category: "Wrap",
      description: "Soft tortilla wrap with grilled chicken and veggies",
      price: 299,
      image: images.burgerOne,
      featured: false,
    },
  ];

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  return (
    <ScrollView
      className="flex-1 bg-neutral-50 px-4 pt-6"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* ===== Stats Cards ===== */}
      <View className="flex-row justify-between mb-6">
        <View className="bg-purple-100 rounded-2xl p-5 w-[48%] items-center">
          <Text className="text-purple-600 text-2xl font-bold">
            {menuItems.length}
          </Text>
          <Text className="text-purple-700 text-sm">Menu Items</Text>
        </View>

        <View className="bg-indigo-100 rounded-2xl p-5 w-[48%] items-center">
          <Text className="text-indigo-600 text-2xl font-bold">
            {CATEGORIES.length}
          </Text>
          <Text className="text-indigo-700 text-sm">Categories</Text>
        </View>
      </View>

      {/* ===== Categories ===== */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-neutral-800 font-semibold">Categories</Text>

        <TouchableOpacity
          className="bg-purple-600 p-2 rounded-xl"
          onPress={() =>
            Alert.alert("Pressed", "You pressed the add categories button!")
          }
        >
          <Image source={images.plus} className="w-5 h-5" tintColor="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        <TouchableOpacity
          onPress={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full mr-2 ${
            selectedCategory === null ? "bg-purple-600" : "bg-neutral-200"
          }`}
        >
          <Text
            className={`text-sm ${
              selectedCategory === null ? "text-white" : "text-neutral-700"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>

        {CATEGORIES.slice(0, 4).map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedCategory === cat.name ? "bg-purple-600" : "bg-neutral-200"
            }`}
          >
            <Text
              className={`text-sm ${
                selectedCategory === cat.name
                  ? "text-white"
                  : "text-neutral-700"
              }`}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ===== Menu Items Header ===== */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-neutral-800 font-semibold">Menu Items</Text>

        <TouchableOpacity
          className="flex-row items-center bg-purple-600 px-4 py-2 rounded-xl"
          onPress={() =>
            Alert.alert("Pressed", "You pressed the add items button!")
          }
        >
          <Image
            source={images.plus}
            className="w-4 h-4 mr-2"
            tintColor="white"
          />
          <Text className="text-white text-sm font-semibold">Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* ===== Menu Cards ===== */}
      {filteredItems.map((item) => (
        <View
          key={item.id}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-neutral-100"
        >
          <View className="flex-row gap-3">
            <Image
              source={item.image}
              className="w-20 h-20 rounded-xl"
              resizeMode="cover"
            />

            <View className="flex-1">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="font-semibold text-neutral-800">
                    {item.name}
                  </Text>
                  <Text className="text-xs text-neutral-500">
                    {item.category}
                  </Text>
                </View>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className={`px-2 py-1 rounded ${
                      item.featured ? "bg-yellow-100" : "bg-neutral-100"
                    }`}
                    onPress={() =>
                      Alert.alert("Pressed", "You pressed add to fvrt!")
                    }
                  >
                    <Image
                      source={images.star}
                      className="w-4 h-4"
                      tintColor={item.featured ? "#FACC15" : "#6B7280"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Alert.alert("Pressed", "You pressed edit!")}
                  >
                    <Image
                      source={images.pencil}
                      className="w-4 h-4"
                      tintColor="#6B7280"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity              onPress={() => Alert.alert("Pressed", "You pressed delete!")}>
                    <Image
                      source={images.trash}
                      className="w-4 h-4"
                      tintColor="#EF4444"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text numberOfLines={2} className="text-sm text-neutral-500 mt-1">
                {item.description}
              </Text>

              <Text className="text-purple-600 mt-2 font-semibold">
                Rs {item.price}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
