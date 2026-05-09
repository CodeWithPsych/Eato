import { images } from "@/constants";
import { api } from "@/services/api";
import {
  addChefAsync,
  deleteChefAsync,
  fetchChefsAsync,
  logoutOwnerAsync,
  selectOwnerChefs,
  selectOwnerChefsStatus,
  selectOwnerEmail,
  selectOwnerName,
  selectOwnerRestaurantId,
  updateChefAsync,
} from "@/services/ownerSlice";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

// ── Safe key helper ────────────────────────────────────────────
// addChefAsync returns { chefId, name, kitchenId } — no _id / id field.
// fetchChefsAsync returns full objects with _id.
const chefKey = (chef) =>
  String(chef._id ?? chef.chefId ?? chef.id ?? Math.random());

export default function Profile() {
  const dispatch = useDispatch();
  const chefs = useSelector(selectOwnerChefs);
  const chefsStatus = useSelector(selectOwnerChefsStatus);
  const ownerName = useSelector(selectOwnerName);
  const ownerEmail = useSelector(selectOwnerEmail);
  const restaurantId = useSelector(selectOwnerRestaurantId);

  // ── Chef modal state ───────────────────────────────────────
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newChefName, setNewChefName] = useState("");
  const [newChefUsername, setNewChefUsername] = useState("");
  const [newChefPassword, setNewChefPassword] = useState("");
  const [addingChef, setAddingChef] = useState(false);

  // ── Password change state ──────────────────────────────────
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  useEffect(() => {
    dispatch(fetchChefsAsync());
  }, [dispatch]);

  // ── Add Chef ───────────────────────────────────────────────
  const handleAddChef = async () => {
    if (!newChefName.trim() || !newChefUsername.trim() || !newChefPassword) {
      Alert.alert("Validation", "All fields are required");
      return;
    }
    if (newChefPassword.length < 6) {
      Alert.alert("Validation", "Password must be at least 6 characters");
      return;
    }
    setAddingChef(true);
    const result = await dispatch(
      addChefAsync({
        name: newChefName.trim(),
        username: newChefUsername.trim().toLowerCase(),
        password: newChefPassword,
      }),
    );
    setAddingChef(false);

    if (addChefAsync.fulfilled.match(result)) {
      setAddModalVisible(false);
      setNewChefName("");
      setNewChefUsername("");
      setNewChefPassword("");
      dispatch(fetchChefsAsync()); // refresh list
    } else {
      Alert.alert("Error", result.payload ?? "Failed to add chef");
    }
  };

  // ── Delete Chef ────────────────────────────────────────────
  const handleDeleteChef = (chef) => {
    Alert.alert("Remove Chef", `Remove ${chef.name} from your kitchen?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const chefId = chef._id ?? chef.id;
          await dispatch(deleteChefAsync(chefId));
          dispatch(fetchChefsAsync());
        },
      },
    ]);
  };

  // ── Toggle Chef Active ────────────────────────────────────
  const handleToggleActive = async (chef) => {
    const chefId = chef._id ?? chef.id;
    const result = await dispatch(
      updateChefAsync({ chefId, updates: { isActive: !chef.isActive } }),
    );
    if (updateChefAsync.fulfilled.match(result)) {
      dispatch(fetchChefsAsync());
    }
  };

  // ── Change Password ────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      Alert.alert("Validation", "All password fields are required");
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert("Validation", "New passwords do not match");
      return;
    }
    if (newPw.length < 8) {
      Alert.alert("Validation", "New password must be at least 8 characters");
      return;
    }
    setChangingPw(true);
    try {
      await api.patch("/owner/auth/change-password", {
        currentPassword: currentPw,
        newPassword: newPw,
      });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      Alert.alert("Success", "Password updated successfully");
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.message ?? "Failed to update password",
      );
    } finally {
      setChangingPw(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await dispatch(logoutOwnerAsync());
          router.replace("/owner");
        },
      },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-neutral-50 px-4 pt-6 pb-24"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Owner Info Card */}
      <View className="bg-purple-600 rounded-2xl p-5 mb-4">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
            <Image
              source={images.user2}
              className="w-7 h-7"
              tintColor="white"
            />
          </View>
          <View>
            <Text className="text-white font-quicksand-bold text-lg">
              {ownerName ?? "Owner"}
            </Text>
            <Text className="text-white/70 text-sm">{ownerEmail ?? "—"}</Text>
          </View>
        </View>
      </View>

      {/* Chef Accounts */}
      <View className="bg-white rounded-2xl p-4 mb-4 border border-neutral-100">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <Image
              source={images.chef}
              className="w-5 h-5"
              tintColor="#7C3AED"
            />
            <Text className="text-neutral-800 font-quicksand-semibold">
              Chef Accounts
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setAddModalVisible(true)}
            className="flex-row items-center bg-purple-600 px-3 py-2 rounded-lg gap-1"
          >
            <Image source={images.plus} className="w-4 h-4" tintColor="white" />
            <Text className="text-white text-sm font-quicksand-medium">
              Add Chef
            </Text>
          </TouchableOpacity>
        </View>

        {chefsStatus === "loading" && (
          <View className="py-6 items-center">
            <ActivityIndicator color="#7C3AED" />
          </View>
        )}

        {chefsStatus !== "loading" && chefs.length === 0 && (
          <View className="py-6 items-center">
            <Text className="text-neutral-400 font-quicksand-medium text-sm">
              No chefs added yet. Add your kitchen staff.
            </Text>
          </View>
        )}

        {chefs.map((chef) => (
          <View
            key={chefKey(chef)}
            className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 mb-3"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-neutral-800 font-quicksand-semibold">
                  {chef.name}
                </Text>

                <Text className="text-neutral-500 text-sm">
                  @{chef.kitchenId ?? chef.username}
                </Text>

                <View className="flex-row items-center gap-2 mt-1">
                  <View
                    className={`w-2 h-2 rounded-full ${
                      chef.isActive !== false ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />

                  <Text className="text-xs text-neutral-500">
                    {chef.isActive !== false ? "Active" : "Inactive"}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => handleToggleActive(chef)}
                  className="p-2 rounded-lg bg-purple-50"
                >
                  <Text className="text-purple-600 text-xs font-quicksand-medium">
                    {chef.isActive !== false ? "Disable" : "Enable"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteChef(chef)}
                  className="p-2 rounded-lg bg-red-50"
                >
                  <Image
                    source={images.trash}
                    className="w-4 h-4"
                    tintColor="#ef4444"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {chef.createdAt ? (
              <Text className="text-neutral-400 text-xs mt-2">
                Added:{" "}
                {new Date(chef.createdAt).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            ) : null}
          </View>
        ))}
      </View>

      {/* Change Password */}
      <View className="bg-white rounded-2xl p-4 mb-4 border border-neutral-100">
        <View className="flex-row items-center mb-3 gap-2">
          <Image source={images.lock} className="w-5 h-5" tintColor="#7C3AED" />
          <Text className="text-neutral-800 font-quicksand-semibold">
            Change Password
          </Text>
        </View>

        <Text className="text-neutral-600 mb-1 text-sm">Current Password</Text>
        <View className="relative mb-3 justify-center">
          <TextInput
            value={currentPw}
            onChangeText={setCurrentPw}
            placeholder="Enter current password"
            secureTextEntry={!showCurrentPw}
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 pr-12"
          />
          <TouchableOpacity
            onPress={() => setShowCurrentPw(!showCurrentPw)}
            className="absolute right-3"
          >
            <Image
              source={showCurrentPw ? images.visible : images.hide}
              className="w-5 h-5"
              tintColor="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        <Text className="text-neutral-600 mb-1 text-sm">New Password</Text>
        <View className="relative mb-3 justify-center">
          <TextInput
            value={newPw}
            onChangeText={setNewPw}
            placeholder="Enter new password"
            secureTextEntry={!showNewPw}
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 pr-12"
          />
          <TouchableOpacity
            onPress={() => setShowNewPw(!showNewPw)}
            className="absolute right-3"
          >
            <Image
              source={showNewPw ? images.visible : images.hide}
              className="w-5 h-5"
              tintColor="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        <Text className="text-neutral-600 mb-1 text-sm">
          Confirm New Password
        </Text>
        <TextInput
          value={confirmPw}
          onChangeText={setConfirmPw}
          placeholder="Confirm new password"
          secureTextEntry
          className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-4"
        />

        <TouchableOpacity
          onPress={handleChangePassword}
          disabled={changingPw}
          className={`py-3 rounded-xl ${changingPw ? "bg-purple-400" : "bg-purple-600"}`}
        >
          {changingPw ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-quicksand-medium">
              Update Password
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex-row items-center justify-center gap-2"
      >
        <Image source={images.logout} className="w-5 h-5" tintColor="#ef4444" />
        <Text className="text-red-600 font-quicksand-semibold">Logout</Text>
      </TouchableOpacity>

      {/* Add Chef Modal */}
      <Modal
        transparent
        visible={addModalVisible}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-lg font-quicksand-bold text-neutral-800 mb-4">
              Add Chef Account
            </Text>

            <Text className="text-neutral-600 mb-1 text-sm">Full Name *</Text>
            <TextInput
              value={newChefName}
              onChangeText={setNewChefName}
              placeholder="e.g. Chef Ahmed"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-3"
            />

            <Text className="text-neutral-600 mb-1 text-sm">
              Kitchen ID (username) *
            </Text>
            <TextInput
              value={newChefUsername}
              onChangeText={(t) =>
                setNewChefUsername(t.toLowerCase().replace(/\s/g, ""))
              }
              placeholder="e.g. chef_ahmed"
              autoCapitalize="none"
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-3"
            />

            <Text className="text-neutral-600 mb-1 text-sm">Password *</Text>
            <TextInput
              value={newChefPassword}
              onChangeText={setNewChefPassword}
              placeholder="Minimum 6 characters"
              secureTextEntry
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-5"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setAddModalVisible(false);
                  setNewChefName("");
                  setNewChefUsername("");
                  setNewChefPassword("");
                }}
                className="flex-1 bg-neutral-200 py-3 rounded-xl"
              >
                <Text className="text-center text-neutral-700 font-quicksand-medium">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddChef}
                disabled={addingChef}
                className={`flex-1 py-3 rounded-xl ${
                  addingChef ? "bg-purple-400" : "bg-purple-600"
                }`}
              >
                {addingChef ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-center text-white font-quicksand-semibold">
                    Add Chef
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
