import { images } from "@/constants";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
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
  selectChefError,
} from "@/services/chefSlice";
import { selectOwnerRestaurantId } from "@/services/ownerSlice";

const DEMO_RESTAURANT_ID = "res_001";

export default function KitchenDashboard() {
  const dispatch     = useDispatch();
  const restaurantId = useSelector(selectOwnerRestaurantId) ?? DEMO_RESTAURANT_ID;
  const orders       = useSelector(selectKitchenOrders);
  const fetchStatus  = useSelector(selectChefFetchStatus);
  const error        = useSelector(selectChefError);

  const load = () => dispatch(fetchKitchenOrdersAsync(restaurantId));

  useEffect(() => { load(); }, [dispatch, restaurantId]);

  const pendingCount = orders.filter((o) =>
    ["pending", "Pending"].includes(o.status)
  ).length;
  const activeCount = orders.filter((o) => o.status === "accepted").length;
  const readyCount  = orders.filter((o) => o.status === "ready").length;

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      {/* Header */}
      <View className="bg-green-600 px-4 pt-6 pb-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={images.arrowBack} className="size-6" tintColor="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-quicksand-bold">Kitchen Dashboard</Text>
          <TouchableOpacity onPress={load}>
            <Image source={images.bell} className="size-6" tintColor="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-around mt-4 bg-green-700 rounded-2xl p-3">
          {[
            { label: "Pending", count: pendingCount, color: "text-yellow-300" },
            { label: "Active",  count: activeCount,  color: "text-blue-300"   },
            { label: "Ready",   count: readyCount,   color: "text-green-300"  },
          ].map((s) => (
            <View key={s.label} className="items-center">
              <Text className={`text-2xl font-bold ${s.color}`}>{s.count}</Text>
              <Text className="text-white/70 text-xs">{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Loading */}
      {fetchStatus === "loading" && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      )}

      {/* Error */}
      {fetchStatus === "failed" && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-500 text-center mb-4">
            {error?.message ?? "Failed to load orders"}
          </Text>
          <TouchableOpacity onPress={load} className="bg-green-600 px-6 py-3 rounded-xl">
            <Text className="text-white font-quicksand-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Orders list */}
      {fetchStatus === "succeeded" && (
        <ScrollView
          className="px-4 mt-4"
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={load} tintColor="#16a34a" />
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
            </View>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={(id, eta) => dispatch(acceptOrderAsync({ orderId: id, eta }))}
                onReject={(id)      => dispatch(rejectOrderAsync(id))}
                onReady={(id)       => dispatch(markOrderReadyAsync(id))}
              />
            ))
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}