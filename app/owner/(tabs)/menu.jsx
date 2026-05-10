/**
 * Owner Menu Tab
 * ─────────────────────────────────────────────────────────────
 * • Manage menu items  (add / edit / delete)
 * • Manage categories  (add / delete)   ← NEW
 * • Image upload via expo-image-picker → multipart to Cloudinary
 * • Emoji fallback if no image chosen
 * • Letter-on-colour fallback if neither image nor emoji
 */

import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { images } from "@/constants";
import {
  fetchOwnerMenuAsync,
  fetchOwnerCategoriesAsync,
  addMenuItemAsync,
  editMenuItemAsync,
  deleteMenuItemAsync,
  addCategoryAsync,
  deleteCategoryAsync,
  selectOwnerMenu,
  selectOwnerCategories,
  selectOwnerMenuStatus,
} from "@/services/ownerSlice";
import FoodImage from "@/components/FoodImage";

/* ── tiny helper ─────────────────────────────────────────── */
const EMOJI_SUGGESTIONS = [
  "🍕","🍔","🍟","🌮","🌯","🍜","🍝","🍱","🍣","🍤",
  "🥗","🥙","🧆","🥘","🫕","🍛","🍲","🍙","🥩","🍗",
  "🧁","🍰","🎂","🍩","🍦","🍫","☕","🧋","🥤","🍹",
];

function EmojiPicker({ selected, onSelect }) {
  return (
    <View className="flex-row flex-wrap gap-2 mt-2 mb-3">
      {EMOJI_SUGGESTIONS.map((e, idx) => (
        <TouchableOpacity
          key={`emoji-${idx}-${e}`}
          onPress={() => onSelect(selected === e ? "" : e)}
          className={`w-10 h-10 rounded-xl items-center justify-center ${
            selected === e ? "bg-orange-200 border-2 border-orange-500" : "bg-neutral-100"
          }`}
        >
          <Text style={{ fontSize: 22 }}>{e}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ── image picker helper ─────────────────────────────────── */
async function pickImage() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission required", "Allow photo access to upload images.");
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.7,
    allowsEditing: true,
    aspect: [1, 1],
  });
  if (result.canceled) return null;
  return result.assets[0];
}

/* ── ImageUploadBox ──────────────────────────────────────── */
function ImageUploadBox({ imageUri, existingUrl, emoji, name, onPick, onClear }) {
  const preview = imageUri || existingUrl;
  return (
    <View className="items-center mb-3">
      <TouchableOpacity onPress={onPick} activeOpacity={0.8}>
        <View className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-orange-300">
          {preview ? (
            <FoodImage
              image={preview}
              emoji={!preview ? emoji : undefined}
              name={name}
              className="w-24 h-24"
              imgClassName="w-full h-full"
            />
          ) : emoji ? (
            <FoodImage emoji={emoji} name={name} className="w-24 h-24" />
          ) : (
            <View className="w-24 h-24 bg-orange-50 items-center justify-center">
              <Image source={images.plus} className="w-8 h-8" tintColor="#fb923c" />
              <Text className="text-orange-400 text-xs mt-1">Add Photo</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      {preview && (
        <TouchableOpacity onPress={onClear} className="mt-1">
          <Text className="text-red-400 text-xs">Remove image</Text>
        </TouchableOpacity>
      )}
      {!preview && (
        <Text className="text-neutral-400 text-xs mt-1">
          Tap to upload (optional)
        </Text>
      )}
    </View>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function Menu() {
  const dispatch = useDispatch();
  const menuItems = useSelector(selectOwnerMenu);
  const categories = useSelector(selectOwnerCategories);
  const menuStatus = useSelector(selectOwnerMenuStatus);

  const [activeTab, setActiveTab] = useState("menu"); // "menu" | "categories"
  const [selectedCategory, setSelectedCategory] = useState(null);

  /* ── add item modal ─────────────────────────────────────── */
  const [addItemVisible, setAddItemVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCat, setNewCat] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newEmoji, setNewEmoji] = useState("");
  const [newImageAsset, setNewImageAsset] = useState(null); // local file
  const [addingItem, setAddingItem] = useState(false);

  /* ── edit item modal ────────────────────────────────────── */
  const [editItemVisible, setEditItemVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [editImageAsset, setEditImageAsset] = useState(null);
  const [editingItemSaving, setEditingItemSaving] = useState(false);

  /* ── add category modal ─────────────────────────────────── */
  const [addCatVisible, setAddCatVisible] = useState(false);
  const [catName, setCatName] = useState("");
  const [catEmoji, setCatEmoji] = useState("");
  const [catImageAsset, setCatImageAsset] = useState(null);
  const [addingCat, setAddingCat] = useState(false);

  const load = () => {
    dispatch(fetchOwnerMenuAsync());
    dispatch(fetchOwnerCategoriesAsync());
  };

  useEffect(() => { load(); }, [dispatch]);

  const categoryNames = categories.map((c) =>
    typeof c === "string" ? c : c.name
  );

  const filteredItems = selectedCategory
    ? menuItems.filter((i) => i.category === selectedCategory)
    : menuItems;

  /* ── Add Item ──────────────────────────────────────────── */
  const handleAddItem = async () => {
    if (!newName.trim() || !newPrice.trim() || !newCat.trim()) {
      Alert.alert("Validation", "Name, price and category are required.");
      return;
    }
    if (isNaN(parseFloat(newPrice))) {
      Alert.alert("Validation", "Please enter a valid price.");
      return;
    }
    setAddingItem(true);
    const itemData = {
      name: newName.trim(),
      price: parseFloat(newPrice),
      category: newCat.trim(),
      description: newDesc.trim(),
      emoji: newEmoji,
    };
    if (newImageAsset) {
      // Build a File-like object for multipart
      const uri = newImageAsset.uri;
      const ext = uri.split(".").pop();
      itemData.imageFile = {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name: `item_${Date.now()}.${ext}`,
        type: `image/${ext === "jpg" ? "jpeg" : ext}`,
      };
    }
    await dispatch(addMenuItemAsync({ item: itemData }));
    setAddingItem(false);
    setAddItemVisible(false);
    resetAddItem();
  };

  const resetAddItem = () => {
    setNewName(""); setNewPrice(""); setNewCat("");
    setNewDesc(""); setNewEmoji(""); setNewImageAsset(null);
  };

  /* ── Edit Item ─────────────────────────────────────────── */
  const openEdit = (item) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditPrice(String(item.price));
    setEditDesc(item.description ?? "");
    setEditEmoji(item.emoji ?? "");
    setEditImageAsset(null);
    setEditItemVisible(true);
  };

  const handleEditItem = async () => {
    if (!editName.trim() || !editPrice.trim()) {
      Alert.alert("Validation", "Name and price are required.");
      return;
    }
    setEditingItemSaving(true);
    const itemId = editingItem._id ?? editingItem.id;
    const updates = {
      name: editName.trim(),
      price: parseFloat(editPrice),
      description: editDesc.trim(),
      emoji: editEmoji,
    };
    if (editImageAsset) {
      const uri = editImageAsset.uri;
      const ext = uri.split(".").pop();
      updates.imageFile = {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name: `item_${Date.now()}.${ext}`,
        type: `image/${ext === "jpg" ? "jpeg" : ext}`,
      };
    }
    await dispatch(editMenuItemAsync({ itemId, updates }));
    setEditingItemSaving(false);
    setEditItemVisible(false);
    setEditingItem(null);
  };

  /* ── Delete Item ───────────────────────────────────────── */
  const handleDeleteItem = (item) => {
    Alert.alert("Delete Item", `Remove "${item.name}" from the menu?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: () => dispatch(deleteMenuItemAsync({ itemId: item._id ?? item.id })),
      },
    ]);
  };

  /* ── Add Category ──────────────────────────────────────── */
  const handleAddCategory = async () => {
    if (!catName.trim()) {
      Alert.alert("Validation", "Category name is required.");
      return;
    }
    setAddingCat(true);
    let imageFile;
    if (catImageAsset) {
      const uri = catImageAsset.uri;
      const ext = uri.split(".").pop();
      imageFile = {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name: `cat_${Date.now()}.${ext}`,
        type: `image/${ext === "jpg" ? "jpeg" : ext}`,
      };
    }
    await dispatch(addCategoryAsync({ name: catName.trim(), emoji: catEmoji, imageFile }));
    setAddingCat(false);
    setAddCatVisible(false);
    setCatName(""); setCatEmoji(""); setCatImageAsset(null);
    dispatch(fetchOwnerCategoriesAsync());
  };

  /* ── Delete Category ───────────────────────────────────── */
  const handleDeleteCategory = (cat) => {
    const catId = cat._id ?? cat.id;
    const name = cat.name ?? cat;
    Alert.alert("Delete Category", `Remove "${name}"? Menu items in this category won't be deleted.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          await dispatch(deleteCategoryAsync({ categoryId: catId }));
          dispatch(fetchOwnerCategoriesAsync());
        },
      },
    ]);
  };

  if (menuStatus === "loading" || menuStatus === "idle") {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50">
      {/* ── Tab Bar ──────────────────────────────────────── */}
      <View className="flex-row mx-4 mt-4 mb-2 bg-neutral-200 rounded-2xl p-1">
        {["menu", "categories"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl items-center ${
              activeTab === tab ? "bg-purple-600" : ""
            }`}
          >
            <Text
              className={`capitalize font-quicksand-semibold text-sm ${
                activeTab === tab ? "text-white" : "text-neutral-600"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ══════════════ MENU TAB ════════════════════════════ */}
      {activeTab === "menu" && (
        <ScrollView
          className="flex-1 px-4 pt-2"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Stats */}
          <View className="flex-row justify-between mb-4">
            <View className="bg-purple-100 rounded-2xl p-4 w-[48%] items-center">
              <Text className="text-purple-600 text-2xl font-bold">{menuItems.length}</Text>
              <Text className="text-purple-700 text-sm">Menu Items</Text>
            </View>
            <View className="bg-indigo-100 rounded-2xl p-4 w-[48%] items-center">
              <Text className="text-indigo-600 text-2xl font-bold">{categoryNames.length}</Text>
              <Text className="text-indigo-700 text-sm">Categories</Text>
            </View>
          </View>

          {/* Category filter */}
          <Text className="text-neutral-800 font-quicksand-semibold mb-2">Filter</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === null ? "bg-purple-600" : "bg-neutral-200"
              }`}
            >
              <Text className={selectedCategory === null ? "text-white text-sm" : "text-neutral-700 text-sm"}>All</Text>
            </TouchableOpacity>
            {categoryNames.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setSelectedCategory(c)}
                className={`px-4 py-2 rounded-full mr-2 ${
                  selectedCategory === c ? "bg-purple-600" : "bg-neutral-200"
                }`}
              >
                <Text className={selectedCategory === c ? "text-white text-sm" : "text-neutral-700 text-sm"}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Header row */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-neutral-800 font-quicksand-semibold">Menu Items</Text>
            <TouchableOpacity
              onPress={() => setAddItemVisible(true)}
              className="flex-row items-center bg-purple-600 px-3 py-2 rounded-xl"
            >
              <Image source={images.plus} className="w-4 h-4 mr-1" tintColor="white" />
              <Text className="text-white text-sm font-quicksand-semibold">Add Item</Text>
            </TouchableOpacity>
          </View>

          {/* Menu cards */}
          {filteredItems.map((item) => {
            const itemId = item._id ?? item.id;
            return (
              <View key={itemId} className="bg-white rounded-2xl p-3 mb-3 shadow-sm border border-neutral-100">
                <View className="flex-row gap-3">
                  {/* Image/emoji/letter */}
                  <View className="w-20 h-20 rounded-xl overflow-hidden">
                    <FoodImage
                      image={item.image}
                      emoji={item.emoji}
                      name={item.name}
                      className="w-20 h-20"
                      imgClassName="w-full h-full"
                    />
                  </View>

                  <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1 mr-2">
                        <Text className="font-quicksand-semibold text-neutral-800">{item.name}</Text>
                        <Text className="text-xs text-neutral-500">{item.category}</Text>
                      </View>
                      <View className="flex-row gap-2 items-center">
                        <TouchableOpacity onPress={() => openEdit(item)} className="p-1">
                          <Image source={images.pencil} className="w-4 h-4" tintColor="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteItem(item)} className="p-1">
                          <Image source={images.trash} className="w-4 h-4" tintColor="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {item.description ? (
                      <Text numberOfLines={2} className="text-sm text-neutral-500 mt-1">{item.description}</Text>
                    ) : null}

                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-purple-600 font-quicksand-semibold">Rs {item.price}</Text>
                      <View className={`px-2 py-1 rounded-full ${item.isAvailable !== false ? "bg-green-100" : "bg-red-100"}`}>
                        <Text className={`text-xs ${item.isAvailable !== false ? "text-green-700" : "text-red-700"}`}>
                          {item.isAvailable !== false ? "Available" : "Unavailable"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}

          {filteredItems.length === 0 && (
            <View className="items-center py-16">
              <Text className="text-neutral-400 font-quicksand-medium">No items found</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* ══════════════ CATEGORIES TAB ══════════════════════ */}
      {activeTab === "categories" && (
        <ScrollView
          className="flex-1 px-4 pt-2"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-neutral-800 font-quicksand-semibold">
              Categories ({categories.length})
            </Text>
            <TouchableOpacity
              onPress={() => setAddCatVisible(true)}
              className="flex-row items-center bg-purple-600 px-3 py-2 rounded-xl"
            >
              <Image source={images.plus} className="w-4 h-4 mr-1" tintColor="white" />
              <Text className="text-white text-sm font-quicksand-semibold">Add Category</Text>
            </TouchableOpacity>
          </View>

          {categories.length === 0 && (
            <View className="items-center py-16">
              <Text className="text-neutral-400 font-quicksand-medium">No categories yet</Text>
            </View>
          )}

          {categories.map((cat, idx) => {
            const catName = typeof cat === "string" ? cat : cat.name;
            const catEmoji = typeof cat === "object" ? cat.emoji : "";
            const catImage = typeof cat === "object" ? cat.image : "";
            const catId = typeof cat === "object" ? (cat._id ?? cat.id) : idx;
            const itemCount = menuItems.filter((i) => i.category === catName).length;

            return (
              <View key={String(catId)} className="bg-white rounded-2xl p-3 mb-3 border border-neutral-100 flex-row items-center gap-3">
                <View className="w-14 h-14 rounded-xl overflow-hidden">
                  <FoodImage
                    image={catImage}
                    emoji={catEmoji}
                    name={catName}
                    className="w-14 h-14"
                    imgClassName="w-full h-full"
                  />
                </View>

                <View className="flex-1">
                  <Text className="font-quicksand-semibold text-neutral-800">{catName}</Text>
                  <Text className="text-xs text-neutral-500">{itemCount} item{itemCount !== 1 ? "s" : ""}</Text>
                </View>

                {typeof cat === "object" && cat._id && (
                  <TouchableOpacity onPress={() => handleDeleteCategory(cat)} className="p-2">
                    <Image source={images.trash} className="w-4 h-4" tintColor="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* ══ MODAL: Add Menu Item ════════════════════════════ */}
      <Modal transparent visible={addItemVisible} animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <ScrollView className="bg-white rounded-t-3xl" contentContainerStyle={{ padding: 24 }}>
            <Text className="text-lg font-quicksand-bold text-neutral-800 mb-4">Add Menu Item</Text>

            {/* Image upload */}
            <ImageUploadBox
              imageUri={newImageAsset?.uri}
              existingUrl={null}
              emoji={newEmoji}
              name={newName}
              onPick={async () => { const a = await pickImage(); if (a) setNewImageAsset(a); }}
              onClear={() => setNewImageAsset(null)}
            />

            {/* Emoji picker */}
            <Text className="text-neutral-600 text-sm mb-1">Or pick an emoji:</Text>
            <EmojiPicker selected={newEmoji} onSelect={setNewEmoji} />

            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Item name *"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-3"
            />

            {/* Category selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
              <View className="flex-row gap-2 py-1">
                {categoryNames.map((cn) => (
                  <TouchableOpacity
                    key={cn}
                    onPress={() => setNewCat(cn)}
                    className={`px-4 py-2 rounded-full ${newCat === cn ? "bg-purple-600" : "bg-neutral-200"}`}
                  >
                    <Text className={`text-sm ${newCat === cn ? "text-white" : "text-neutral-700"}`}>{cn}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {!newCat && (
              <TextInput
                value={newCat}
                onChangeText={setNewCat}
                placeholder="Or type category *"
                className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-3"
              />
            )}

            <TextInput
              value={newPrice}
              onChangeText={setNewPrice}
              placeholder="Price (Rs) *"
              keyboardType="numeric"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-3"
            />
            <TextInput
              value={newDesc}
              onChangeText={setNewDesc}
              placeholder="Description (optional)"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-5"
            />

            <View className="flex-row gap-3 mb-8">
              <TouchableOpacity
                onPress={() => { setAddItemVisible(false); resetAddItem(); }}
                className="flex-1 bg-neutral-200 py-3 rounded-xl"
              >
                <Text className="text-center text-neutral-700 font-quicksand-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddItem}
                disabled={addingItem}
                className={`flex-1 py-3 rounded-xl ${addingItem ? "bg-purple-400" : "bg-purple-600"}`}
              >
                {addingItem
                  ? <ActivityIndicator color="white" />
                  : <Text className="text-center text-white font-quicksand-semibold">Add Item</Text>
                }
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ══ MODAL: Edit Menu Item ═══════════════════════════ */}
      <Modal transparent visible={editItemVisible} animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <ScrollView className="bg-white rounded-t-3xl" contentContainerStyle={{ padding: 24 }}>
            <Text className="text-lg font-quicksand-bold text-neutral-800 mb-4">
              Edit: {editingItem?.name}
            </Text>

            <ImageUploadBox
              imageUri={editImageAsset?.uri}
              existingUrl={editingItem?.image}
              emoji={editEmoji}
              name={editName}
              onPick={async () => { const a = await pickImage(); if (a) setEditImageAsset(a); }}
              onClear={() => setEditImageAsset(null)}
            />

            <Text className="text-neutral-600 text-sm mb-1">Or pick an emoji:</Text>
            <EmojiPicker selected={editEmoji} onSelect={setEditEmoji} />

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
              value={editDesc}
              onChangeText={setEditDesc}
              placeholder="Description"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-5"
            />

            <View className="flex-row gap-3 mb-8">
              <TouchableOpacity
                onPress={() => { setEditItemVisible(false); setEditingItem(null); }}
                className="flex-1 bg-neutral-200 py-3 rounded-xl"
              >
                <Text className="text-center text-neutral-700 font-quicksand-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleEditItem}
                disabled={editingItemSaving}
                className={`flex-1 py-3 rounded-xl ${editingItemSaving ? "bg-purple-400" : "bg-purple-600"}`}
              >
                {editingItemSaving
                  ? <ActivityIndicator color="white" />
                  : <Text className="text-center text-white font-quicksand-semibold">Save Changes</Text>
                }
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ══ MODAL: Add Category ═════════════════════════════ */}
      <Modal transparent visible={addCatVisible} animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <ScrollView className="bg-white rounded-t-3xl" contentContainerStyle={{ padding: 24 }}>
            <Text className="text-lg font-quicksand-bold text-neutral-800 mb-4">Add Category</Text>

            <ImageUploadBox
              imageUri={catImageAsset?.uri}
              existingUrl={null}
              emoji={catEmoji}
              name={catName}
              onPick={async () => { const a = await pickImage(); if (a) setCatImageAsset(a); }}
              onClear={() => setCatImageAsset(null)}
            />

            <Text className="text-neutral-600 text-sm mb-1">Or pick an emoji:</Text>
            <EmojiPicker selected={catEmoji} onSelect={setCatEmoji} />

            <TextInput
              value={catName}
              onChangeText={setCatName}
              placeholder="Category name *"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-5"
            />

            <View className="flex-row gap-3 mb-8">
              <TouchableOpacity
                onPress={() => { setAddCatVisible(false); setCatName(""); setCatEmoji(""); setCatImageAsset(null); }}
                className="flex-1 bg-neutral-200 py-3 rounded-xl"
              >
                <Text className="text-center text-neutral-700 font-quicksand-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddCategory}
                disabled={addingCat}
                className={`flex-1 py-3 rounded-xl ${addingCat ? "bg-purple-400" : "bg-purple-600"}`}
              >
                {addingCat
                  ? <ActivityIndicator color="white" />
                  : <Text className="text-center text-white font-quicksand-semibold">Add Category</Text>
                }
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}