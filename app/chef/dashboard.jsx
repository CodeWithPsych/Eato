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
  const orders = useSelector(selectKitchenOrders);
  const fetchStatus = useSelector(selectChefFetchStatus);
  const actionStatus = useSelector(selectChefActionStatus);
  const error = useSelector(selectChefError);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleAccept = (orderId, eta) => {
    dispatch(acceptOrderAsync({ orderId, eta }));
  };

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

  const handleReady = (orderId) => {
    dispatch(markOrderReadyAsync(orderId));
  };

  const handleLogout = async () => {
    await dispatch(chefLogoutAsync());
    router.replace("/chef");
  };

  const pendingCount = orders.filter((o) =>
    ["pending"].includes((o.status ?? "").toLowerCase())
  ).length;
  const activeCount = orders.filter((o) =>
    ["accepted"].includes((o.status ?? "").toLowerCase())
  ).length;
  const readyCount = orders.filter((o) =>
    ["ready"].includes((o.status ?? "").toLowerCase())
  ).length;

  const isInitialLoading =
    (fetchStatus === "loading" || fetchStatus === "idle") &&
    orders.length === 0;

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

        <View className="flex-row justify-around mt-2 bg-green-700 rounded-2xl p-3">
          {[
            { label: "Pending", count: pendingCount, color: "text-yellow-300" },
            { label: "Active", count: activeCount, color: "text-blue-300" },
            { label: "Ready", count: readyCount, color: "text-green-300" },
          ].map((s) => (
            <View key={s.label} className="items-center">
              <Text className={`text-2xl font-bold ${s.color}`}>{s.count}</Text>
              <Text className="text-white/70 text-xs">{s.label}</Text>
            </View>
          ))}
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
      {fetchStatus === "failed" && orders.length === 0 && (
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

      {/* Orders list */}
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
            <Text className="font-quicksand-semibold text-lg">Live Orders</Text>
          </View>

          {orders.length === 0 ? (
            <View className="items-center justify-center py-16">
              <Image
                source={images.emptyState}
                style={{ width: 160, height: 160 }}
                resizeMode="contain"
              />
              <Text className="text-neutral-500 mt-4 font-quicksand-medium">
                No active orders
              </Text>
              <Text className="text-neutral-400 text-sm mt-1">
                Pull down to refresh
              </Text>
            </View>
          ) : (
            orders.map((order) => (
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