import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { images } from "@/constants";
import {
  fetchOwnerMenuAsync,
  fetchOwnerCategoriesAsync,
  addMenuItemAsync,
  editMenuItemAsync,
  deleteMenuItemAsync,
  selectOwnerMenu,
  selectOwnerCategories,
  selectOwnerMenuStatus,
} from "@/services/ownerSlice";

export default function Menu() {
  const dispatch = useDispatch();
  const menuItems = useSelector(selectOwnerMenu);
  const categories = useSelector(selectOwnerCategories);
  const menuStatus = useSelector(selectOwnerMenuStatus);

  const [selectedCategory, setSelectedCategory] = useState(null);

  // Add item modal state
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");

  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    dispatch(fetchOwnerMenuAsync("res_001"));
    dispatch(fetchOwnerCategoriesAsync("res_001"));
  }, [dispatch]);

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  // ── Add Item ──────────────────────────────────────────────
  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemPrice.trim() || !newItemCategory.trim()) {
      Alert.alert("Validation", "Please fill in name, price and category.");
      return;
    }
    dispatch(
      addMenuItemAsync({
        restaurantId: "res_001",
        item: {
          name: newItemName.trim(),
          price: parseFloat(newItemPrice),
          category: newItemCategory.trim(),
          description: newItemDescription.trim(),
          image: "burgerOne", // default image key
        },
      })
    );
    setAddModalVisible(false);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemCategory("");
    setNewItemDescription("");
  };

  // ── Edit Item ─────────────────────────────────────────────
  const openEditModal = (item) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditPrice(String(item.price));
    setEditDescription(item.description ?? "");
    setEditModalVisible(true);
  };

  const handleEditItem = () => {
    if (!editName.trim() || !editPrice.trim()) {
      Alert.alert("Validation", "Name and price are required.");
      return;
    }
    dispatch(
      editMenuItemAsync({
        restaurantId: "res_001",
        itemId: editingItem.id,
        updates: {
          name: editName.trim(),
          price: parseFloat(editPrice),
          description: editDescription.trim(),
        },
      })
    );
    setEditModalVisible(false);
    setEditingItem(null);
  };

  // ── Delete Item ───────────────────────────────────────────
  const handleDeleteItem = (item) => {
    Alert.alert("Delete Item", `Remove "${item.name}" from the menu?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          dispatch(deleteMenuItemAsync({ restaurantId: "res_001", itemId: item.id })),
      },
    ]);
  };

  if (menuStatus === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-neutral-50 px-4 pt-6"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* ===== Stats Cards ===== */}
      <View className="flex-row justify-between mb-6">
        <View className="bg-purple-100 rounded-2xl p-5 w-[48%] items-center">
          <Text className="text-purple-600 text-2xl font-bold">{menuItems.length}</Text>
          <Text className="text-purple-700 text-sm">Menu Items</Text>
        </View>
        <View className="bg-indigo-100 rounded-2xl p-5 w-[48%] items-center">
          <Text className="text-indigo-600 text-2xl font-bold">{categories.length}</Text>
          <Text className="text-indigo-700 text-sm">Categories</Text>
        </View>
      </View>

      {/* ===== Categories ===== */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-neutral-800 font-semibold">Categories</Text>
        <TouchableOpacity
          className="bg-purple-600 p-2 rounded-xl"
          onPress={() => setAddModalVisible(true)}
        >
          <Image source={images.plus} className="w-5 h-5" tintColor="white" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
        <TouchableOpacity
          onPress={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full mr-2 ${
            selectedCategory === null ? "bg-purple-600" : "bg-neutral-200"
          }`}
        >
          <Text className={`text-sm ${selectedCategory === null ? "text-white" : "text-neutral-700"}`}>
            All
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedCategory === cat ? "bg-purple-600" : "bg-neutral-200"
            }`}
          >
            <Text className={`text-sm ${selectedCategory === cat ? "text-white" : "text-neutral-700"}`}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ===== Menu Items Header ===== */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-neutral-800 font-semibold">Menu Items</Text>
        <TouchableOpacity
          className="flex-row items-center bg-purple-600 px-4 py-2 rounded-xl"
          onPress={() => setAddModalVisible(true)}
        >
          <Image source={images.plus} className="w-4 h-4 mr-2" tintColor="white" />
          <Text className="text-white text-sm font-semibold">Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* ===== Menu Cards ===== */}
      {filteredItems.map((item) => (
        <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-neutral-100">
          <View className="flex-row gap-3">
            <View className="w-20 h-20 rounded-xl bg-orange-50 items-center justify-center overflow-hidden">
              <Text className="text-3xl">🍽️</Text>
            </View>

            <View className="flex-1">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-2">
                  <Text className="font-semibold text-neutral-800">{item.name}</Text>
                  <Text className="text-xs text-neutral-500">{item.category}</Text>
                </View>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className={`px-2 py-1 rounded ${item.featured ? "bg-yellow-100" : "bg-neutral-100"}`}
                    onPress={() =>
                      dispatch(
                        editMenuItemAsync({
                          restaurantId: "res_001",
                          itemId: item.id,
                          updates: { featured: !item.featured },
                        })
                      )
                    }
                  >
                    <Image
                      source={images.star}
                      className="w-4 h-4"
                      tintColor={item.featured ? "#FACC15" : "#6B7280"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Image source={images.pencil} className="w-4 h-4" tintColor="#6B7280" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDeleteItem(item)}>
                    <Image source={images.trash} className="w-4 h-4" tintColor="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              {item.description ? (
                <Text numberOfLines={2} className="text-sm text-neutral-500 mt-1">
                  {item.description}
                </Text>
              ) : null}

              <Text className="text-purple-600 mt-2 font-semibold">Rs {item.price}</Text>
            </View>
          </View>
        </View>
      ))}

      {filteredItems.length === 0 && menuStatus === "succeeded" && (
        <View className="items-center py-16">
          <Text className="text-neutral-400 font-quicksand-medium">No items found</Text>
        </View>
      )}

      {/* ===== Add Item Modal ===== */}
      <Modal transparent visible={addModalVisible} animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-lg font-quicksand-bold text-neutral-800 mb-4">Add Menu Item</Text>

            <TextInput
              value={newItemName}
              onChangeText={setNewItemName}
              placeholder="Item name *"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-3"
            />
            <TextInput
              value={newItemCategory}
              onChangeText={setNewItemCategory}
              placeholder="Category *"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-3"
            />
            <TextInput
              value={newItemPrice}
              onChangeText={setNewItemPrice}
              placeholder="Price (Rs) *"
              keyboardType="numeric"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-3"
            />
            <TextInput
              value={newItemDescription}
              onChangeText={setNewItemDescription}
              placeholder="Description (optional)"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-5"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setAddModalVisible(false)}
                className="flex-1 bg-neutral-200 py-3 rounded-xl"
              >
                <Text className="text-center text-neutral-700 font-quicksand-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddItem}
                className="flex-1 bg-purple-600 py-3 rounded-xl"
              >
                <Text className="text-center text-white font-quicksand-semibold">Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ===== Edit Item Modal ===== */}
      <Modal transparent visible={editModalVisible} animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-lg font-quicksand-bold text-neutral-800 mb-4">Edit Menu Item</Text>

            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Item name *"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-3"
            />
            <TextInput
              value={editPrice}
              onChangeText={setEditPrice}
              placeholder="Price (Rs) *"
              keyboardType="numeric"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-3"
            />
            <TextInput
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Description"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-5"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                className="flex-1 bg-neutral-200 py-3 rounded-xl"
              >
                <Text className="text-center text-neutral-700 font-quicksand-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleEditItem}
                className="flex-1 bg-purple-600 py-3 rounded-xl"
              >
                <Text className="text-center text-white font-quicksand-semibold">Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}