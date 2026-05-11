// app/owner/(tabs)/profile.jsx
// ── Added: QrCodesSection (Table QR Codes block) above Change Password ──

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
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

// ─── Try to import QRCode; falls back to null if not installed ────────────────
let QRCode = null;
try {
  QRCode = require("react-native-qrcode-svg").default;
} catch (_) {
  // library not installed — QR rendering replaced with payload text
}

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchSetupProgress() {
  const res = await api.get("/owner/setup/progress");
  return res.data?.data ?? null;
}

async function regenerateQrApi(tableNumber) {
  const res = await api.patch(
    `/owner/setup/tables/${tableNumber}/regenerate-qr`
  );
  return res.data?.data ?? null;
}

// ── Safe key helper ────────────────────────────────────────────────────────────
const chefKey = (chef) =>
  String(chef._id ?? chef.chefId ?? chef.id ?? Math.random());

// ══════════════════════════════════════════════════════════════════════════════
// QR Card (single table)
// ══════════════════════════════════════════════════════════════════════════════

const QrCard = ({ table, restaurantName, onRegenerate }) => {
  const [regenerating, setRegenerating] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          `${restaurantName} — Table ${table.tableNumber}\n\n` +
          `Scan this QR payload with the Eato app:\n${table.qrPayload}`,
        title: `Table ${table.tableNumber} QR`,
      });
    } catch (e) {
      Alert.alert("Share failed", e.message);
    }
  };

  const handleRegenerate = () => {
    Alert.alert(
      "Regenerate QR",
      `Invalidate the current QR for Table ${table.tableNumber}? Customers will need to rescan.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Regenerate",
          style: "destructive",
          onPress: async () => {
            setRegenerating(true);
            try {
              const updated = await regenerateQrApi(table.tableNumber);
              onRegenerate(table.tableNumber, updated);
            } catch (err) {
              Alert.alert(
                "Error",
                err?.response?.data?.message ?? "Failed to regenerate QR"
              );
            } finally {
              setRegenerating(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-neutral-100">
      {/* Header row */}
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="font-quicksand-bold text-neutral-800 text-base">
            Table {table.tableNumber}
          </Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <View
              className={`w-2 h-2 rounded-full ${
                table.isActive ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <Text className="text-xs text-neutral-400 font-quicksand-medium">
              {table.isActive ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2">
          {/* Share / "download" */}
          <TouchableOpacity
            onPress={handleShare}
            className="w-9 h-9 rounded-xl bg-indigo-50 items-center justify-center"
          >
            <Image
              source={images.download}
              className="w-4 h-4"
              tintColor="#4F46E5"
            />
          </TouchableOpacity>

          {/* Regenerate */}
          <TouchableOpacity
            onPress={handleRegenerate}
            disabled={regenerating}
            className="w-9 h-9 rounded-xl bg-amber-50 items-center justify-center"
          >
            {regenerating ? (
              <ActivityIndicator size="small" color="#D97706" />
            ) : (
              <Image
                source={images.pencil}
                className="w-4 h-4"
                tintColor="#D97706"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* QR Code */}
      <View className="items-center py-2">
        {table.qrPayload ? (
          QRCode ? (
            <View className="p-3 bg-white rounded-xl border border-neutral-100">
              <QRCode
                value={table.qrPayload}
                size={160}
                color="#111827"
                backgroundColor="#ffffff"
                quietZone={4}
              />
            </View>
          ) : (
            /* Fallback when react-native-qrcode-svg is not installed */
            <View className="w-48 bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <View className="flex-row items-center gap-2 mb-2">
                <Image
                  source={images.qrcode}
                  className="w-8 h-8"
                  tintColor="#4F46E5"
                />
                <Text className="text-xs font-quicksand-semibold text-indigo-600">
                  QR Payload
                </Text>
              </View>
              <Text
                className="text-xs text-neutral-500 font-quicksand-medium"
                numberOfLines={3}
                selectable
              >
                {table.qrPayload}
              </Text>
              <Text className="text-xs text-neutral-400 mt-2">
                Install react-native-qrcode-svg to render the QR image
              </Text>
            </View>
          )
        ) : (
          <View className="w-40 h-40 bg-neutral-100 rounded-xl items-center justify-center">
            <Image
              source={images.qrcode}
              className="w-12 h-12"
              tintColor="#D1D5DB"
            />
            <Text className="text-xs text-neutral-400 mt-2">No payload</Text>
          </View>
        )}
      </View>

      {/* Truncated payload label */}
      {table.qrPayload ? (
        <Text
          className="text-center text-xs text-neutral-300 mt-1 font-quicksand-medium"
          numberOfLines={1}
        >
          {table.qrPayload.slice(0, 36)}…
        </Text>
      ) : null}
    </View>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// QR Codes Section (trigger button + full-screen modal)
// ══════════════════════════════════════════════════════════════════════════════

const QrCodesSection = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [restaurantName, setRestaurantName] = useState("Restaurant");
  const [error, setError] = useState("");

  const openModal = useCallback(async () => {
    setModalVisible(true);
    setLoading(true);
    setError("");
    try {
      const data = await fetchSetupProgress();
      setTables(data?.tables ?? []);
      setRestaurantName(data?.name ?? "Restaurant");
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load QR codes");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegenerate = (tableNumber, updated) => {
    if (!updated) return;
    setTables((prev) =>
      prev.map((t) =>
        t.tableNumber === tableNumber
          ? { ...t, qrPayload: updated.qrPayload }
          : t
      )
    );
  };

  return (
    <>
      {/* ── Trigger card ── */}
      <TouchableOpacity
        onPress={openModal}
        className="bg-white rounded-2xl p-4 mb-4 border border-neutral-100 flex-row items-center gap-3"
      >
        <View className="w-12 h-12 bg-indigo-50 rounded-full items-center justify-center">
          <Image
            source={images.qrcode}
            className="w-6 h-6"
            tintColor="#4F46E5"
          />
        </View>
        <View className="flex-1">
          <Text className="text-neutral-800 font-quicksand-semibold">
            Table QR Codes
          </Text>
          <Text className="text-neutral-400 text-xs mt-0.5">
            View, share &amp; regenerate QR codes for each table
          </Text>
        </View>
        <Image
          source={images.arrowRight}
          className="w-4 h-4"
          tintColor="#9CA3AF"
        />
      </TouchableOpacity>

      {/* ── Full-screen modal ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-neutral-50">
          {/* Modal header */}
          <View className="bg-indigo-600 pt-14 pb-5 px-5 flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="w-9 h-9 bg-white/20 rounded-xl items-center justify-center"
            >
              <Image
                source={images.arrowBack}
                className="w-5 h-5"
                tintColor="#fff"
              />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-white text-lg font-quicksand-bold">
                Table QR Codes
              </Text>
              <Text className="text-white/70 text-xs font-quicksand-medium mt-0.5">
                {restaurantName} · {tables.length} table
                {tables.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          {/* Info banner */}
          <View className="bg-indigo-50 border-b border-indigo-100 px-5 py-3">
            <Text className="text-indigo-700 text-xs font-quicksand-medium leading-5">
              📱 Each QR code contains your restaurant ID, table number, and
              WiFi credentials. Tap the{" "}
              <Text className="font-quicksand-bold">share icon</Text> to send it
              to your printer or team.
            </Text>
          </View>

          {/* Content */}
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text className="text-neutral-400 font-quicksand-medium mt-3">
                Loading QR codes…
              </Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center px-8">
              <Text className="text-red-500 text-center font-quicksand-medium mb-4">
                {error}
              </Text>
              <TouchableOpacity
                onPress={openModal}
                className="bg-indigo-600 px-6 py-3 rounded-xl"
              >
                <Text className="text-white font-quicksand-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : tables.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Image
                source={images.qrcode}
                className="w-20 h-20"
                tintColor="#E5E7EB"
              />
              <Text className="text-neutral-400 font-quicksand-semibold text-base mt-3">
                No tables set up yet
              </Text>
              <Text className="text-neutral-300 text-sm mt-1">
                Complete Step 4 of restaurant setup
              </Text>
            </View>
          ) : (
            <ScrollView
              className="flex-1 px-5 pt-4"
              contentContainerStyle={{ paddingBottom: 60 }}
              showsVerticalScrollIndicator={false}
            >
              {tables.map((table) => (
                <QrCard
                  key={table.tableNumber}
                  table={table}
                  restaurantName={restaurantName}
                  onRegenerate={handleRegenerate}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Profile Screen (original + QrCodesSection injected)
// ══════════════════════════════════════════════════════════════════════════════

export default function Profile() {
  const dispatch = useDispatch();
  const chefs = useSelector(selectOwnerChefs);
  const chefsStatus = useSelector(selectOwnerChefsStatus);
  const ownerName = useSelector(selectOwnerName);
  const ownerEmail = useSelector(selectOwnerEmail);
  const restaurantId = useSelector(selectOwnerRestaurantId);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newChefName, setNewChefName] = useState("");
  const [newChefUsername, setNewChefUsername] = useState("");
  const [newChefPassword, setNewChefPassword] = useState("");
  const [addingChef, setAddingChef] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  useEffect(() => {
    dispatch(fetchChefsAsync());
  }, [dispatch]);

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
      })
    );
    setAddingChef(false);
    if (addChefAsync.fulfilled.match(result)) {
      setAddModalVisible(false);
      setNewChefName("");
      setNewChefUsername("");
      setNewChefPassword("");
      dispatch(fetchChefsAsync());
    } else {
      Alert.alert("Error", result.payload ?? "Failed to add chef");
    }
  };

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

  const handleToggleActive = async (chef) => {
    const chefId = chef._id ?? chef.id;
    const result = await dispatch(
      updateChefAsync({ chefId, updates: { isActive: !chef.isActive } })
    );
    if (updateChefAsync.fulfilled.match(result)) dispatch(fetchChefsAsync());
  };

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
        err?.response?.data?.message ?? "Failed to update password"
      );
    } finally {
      setChangingPw(false);
    }
  };

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
      {/* ── Owner Info Card ── */}
      <View className="bg-purple-600 rounded-2xl p-5 mb-4">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
            <Image source={images.user2} className="w-7 h-7" tintColor="white" />
          </View>
          <View>
            <Text className="text-white font-quicksand-bold text-lg">
              {ownerName ?? "Owner"}
            </Text>
            <Text className="text-white/70 text-sm">{ownerEmail ?? "—"}</Text>
          </View>
        </View>
      </View>

      {/* ── Chef Accounts ── */}
      <View className="bg-white rounded-2xl p-4 mb-4 border border-neutral-100">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <Image source={images.chef} className="w-5 h-5" tintColor="#7C3AED" />
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

      {/* ── QR Codes Section ─────────────────────────── NEW ── */}
      <QrCodesSection />

      {/* ── Change Password ── */}
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

        <Text className="text-neutral-600 mb-1 text-sm">Confirm New Password</Text>
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

      {/* ── Logout ── */}
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex-row items-center justify-center gap-2"
      >
        <Image source={images.logout} className="w-5 h-5" tintColor="#ef4444" />
        <Text className="text-red-600 font-quicksand-semibold">Logout</Text>
      </TouchableOpacity>

      {/* ── Add Chef Modal ── */}
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