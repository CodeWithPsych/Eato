import { images } from "@/constants";
import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Image, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
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
  selectChefError,
} from "@/services/chefSlice";

export default function KitchenDashboard() {
  const dispatch = useDispatch();
  const orders = useSelector(selectKitchenOrders);
  const fetchStatus = useSelector(selectChefFetchStatus);
  const error = useSelector(selectChefError);

  useEffect(() => {
    dispatch(fetchKitchenOrdersAsync("res_001"));
  }, [dispatch]);

  const handleAccept = (id, eta) => {
    dispatch(acceptOrderAsync({ orderId: id, eta }));
  };

  const handleReject = (id) => {
    dispatch(rejectOrderAsync(id));
  };

  const handleReady = (id) => {
    dispatch(markOrderReadyAsync(id));
  };

  const pendingCount = orders.filter((o) => o.status === "pending" || o.status === "Pending").length;
  const activeCount = orders.filter((o) => o.status === "accepted").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      {/* HEADER */}
      <View className="bg-green-600 px-4 pt-6 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={images.arrowBack} className="size-6" tintColor="white" />
          </TouchableOpacity>

          <Text className="text-white text-lg font-quicksand-bold">
            Kitchen Dashboard
          </Text>

          <View className="relative">
            <Image source={images.bell} className="size-6" tintColor="white" />
          </View>
        </View>

        <View className="flex-row justify-between px-2 mt-8">
          <Text className="text-white text-sm">Pending: {pendingCount}</Text>
          <Text className="text-white text-sm">Active: {activeCount}</Text>
          <Text className="text-white text-sm">Ready: {readyCount}</Text>
        </View>
      </View>

      {fetchStatus === "loading" && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      )}

      {fetchStatus === "failed" && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-500 text-center">{error?.message ?? "Failed to load orders"}</Text>
          <TouchableOpacity
            onPress={() => dispatch(fetchKitchenOrdersAsync("res_001"))}
            className="mt-4 bg-green-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-quicksand-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {fetchStatus === "succeeded" && (
        <ScrollView className="px-4 mt-4">
          <View className="flex-1 gap-3 flex-row px-4 mt-4 mb-4 items-center">
            <Image
              source={images.clock}
              resizeMethod="contain"
              style={{ tintColor: "black", width: 20, height: 20 }}
            />
            <Text className="font-quicksand-semibold text-lg">New Orders</Text>
          </View>

          {orders.length === 0 ? (
            <View className="items-center justify-center py-16">
              <Image source={images.emptyState} style={{ width: 160, height: 160 }} resizeMode="contain" />
              <Text className="text-neutral-500 mt-4 font-quicksand-medium">No active orders</Text>
            </View>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={handleAccept}
                onReject={handleReject}
                onReady={handleReady}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}