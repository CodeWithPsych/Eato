// ─── app/chef/dashboard.jsx ───────────────────────────────────────────────────
import { images } from "@/constants";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import OrderCard from "@/components/OrderCard";
import {
  fetchKitchenOrdersAsync,
  acceptOrderAsync,
  rejectOrderAsync,
  markOrderReadyAsync,
  selectKitchenOrders,
  selectChefFetchStatus,
  selectChefActionStatus,
  selectChefError,
  chefLogoutAsync,
} from "@/services/chefSlice";

export default function KitchenDashboard() {
  const dispatch = useDispatch();
  const allOrders = useSelector(selectKitchenOrders);
  const fetchStatus = useSelector(selectChefFetchStatus);
  const actionStatus = useSelector(selectChefActionStatus);
  const error = useSelector(selectChefError);
  const [refreshing, setRefreshing] = useState(false);

  // Default selected tab is "pending"
  const [activeTab, setActiveTab] = useState("pending");

  // Derive per-status lists
  const pendingOrders = allOrders.filter(
    (o) => (o.status ?? "").toLowerCase() === "pending"
  );
  const activeOrders = allOrders.filter(
    (o) => (o.status ?? "").toLowerCase() === "accepted"
  );
  const readyOrders = allOrders.filter(
    (o) => (o.status ?? "").toLowerCase() === "ready"
  );

  // What the scroll list actually shows
  const visibleOrders =
    activeTab === "pending"
      ? pendingOrders
      : activeTab === "active"
      ? activeOrders
      : readyOrders;

  const load = useCallback(() => {
    dispatch(fetchKitchenOrdersAsync());
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchKitchenOrdersAsync());
    setRefreshing(false);
  }, [dispatch]);

  const handleAccept = (orderId, eta) =>
    dispatch(acceptOrderAsync({ orderId, eta }));

  const handleReject = (orderId) => {
    Alert.alert("Reject Order", "Are you sure you want to reject this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: () => dispatch(rejectOrderAsync(orderId)),
      },
    ]);
  };

  const handleReady = (orderId) => dispatch(markOrderReadyAsync(orderId));

  const handleLogout = async () => {
    await dispatch(chefLogoutAsync());
    router.replace("/chef");
  };

  const isInitialLoading =
    (fetchStatus === "loading" || fetchStatus === "idle") &&
    allOrders.length === 0;

  const tabs = [
    {
      key: "pending",
      label: "Pending",
      count: pendingOrders.length,
      selectedText: "text-yellow-300",
      selectedBorder: "border-yellow-300",
    },
    {
      key: "active",
      label: "Active",
      count: activeOrders.length,
      selectedText: "text-blue-300",
      selectedBorder: "border-blue-300",
    },
    {
      key: "ready",
      label: "Ready",
      count: readyOrders.length,
      selectedText: "text-green-300",
      selectedBorder: "border-green-300",
    },
  ];

  const sectionLabel =
    activeTab === "pending"
      ? "Pending Orders"
      : activeTab === "active"
      ? "Active Orders"
      : "Ready Orders";

  const emptyLabel =
    activeTab === "pending"
      ? "No pending orders"
      : activeTab === "active"
      ? "No active orders"
      : "No orders ready yet";

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      {/* Header */}
      <View className="bg-green-600 px-4 pt-4 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity onPress={handleLogout}>
            <Image source={images.logout} className="size-6" tintColor="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-quicksand-bold">
            Kitchen Dashboard
          </Text>
          <TouchableOpacity onPress={load}>
            <Image source={images.bell} className="size-6" tintColor="white" />
          </TouchableOpacity>
        </View>

        {/* Clickable tab bar — same layout as before, now tappable */}
        <View className="flex-row justify-around mt-2 bg-green-700 rounded-2xl p-3">
          {tabs.map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
                className={`flex-1 items-center py-1 mx-1 rounded-xl border-2 ${
                  selected ? tab.selectedBorder : "border-transparent"
                }`}
              >
                <Text
                  className={`text-2xl font-bold ${
                    selected ? tab.selectedText : "text-white/50"
                  }`}
                >
                  {tab.count}
                </Text>
                <Text
                  className={`text-xs ${
                    selected ? "text-white" : "text-white/40"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Action loading overlay */}
      {actionStatus === "loading" && (
        <View className="absolute inset-0 bg-black/20 z-10 items-center justify-center">
          <View className="bg-white rounded-2xl p-4">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-neutral-600 mt-2 font-quicksand-medium">
              Updating...
            </Text>
          </View>
        </View>
      )}

      {/* Initial loading */}
      {isInitialLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-neutral-500 mt-3 font-quicksand-medium">
            Loading orders...
          </Text>
        </View>
      )}

      {/* Error */}
      {fetchStatus === "failed" && allOrders.length === 0 && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-500 text-center mb-4">
            {error ?? "Failed to load orders"}
          </Text>
          <TouchableOpacity
            onPress={load}
            className="bg-green-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-quicksand-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Orders for the selected tab */}
      {!isInitialLoading && (
        <ScrollView
          className="px-4 mt-4"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#16a34a"
            />
          }
        >
          <View className="flex-row items-center gap-2 px-1 mb-4">
            <Image
              source={images.clock}
              style={{ tintColor: "#111", width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="font-quicksand-semibold text-lg">
              {sectionLabel}
            </Text>
          </View>

          {visibleOrders.length === 0 ? (
            <View className="items-center justify-center py-16">
              <Image
                source={images.emptyState}
                style={{ width: 160, height: 160 }}
                resizeMode="contain"
              />
              <Text className="text-neutral-500 mt-4 font-quicksand-medium">
                {emptyLabel}
              </Text>
              <Text className="text-neutral-400 text-sm mt-1">
                Pull down to refresh
              </Text>
            </View>
          ) : (
            visibleOrders.map((order) => (
              <OrderCard
                key={order._id ?? order.id}
                order={order}
                onAccept={handleAccept}
                onReject={handleReject}
                onReady={handleReady}
              />
            ))
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}