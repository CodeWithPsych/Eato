import { images } from "@/constants";
import { router } from "expo-router";
import { ScrollView, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderCard from "@/components/OrderCard";
import { useOrdersStore } from "@/store/orders.store";

export default function KitchenDashboard() {
  const { orders, acceptOrder, rejectOrder, markOrderReady } = useOrdersStore();

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
          <Text className="text-white text-sm">Pending: {orders.filter(o => o.status === "pending").length}</Text>
          <Text className="text-white text-sm">Active: {orders.filter(o => o.status === "accepted").length}</Text>
          <Text className="text-white text-sm">Ready: {orders.filter(o => o.status === "ready").length}</Text>
        </View>
      </View>

      <ScrollView className="px-4 mt-4">
        <View className="flex-1 gap-3 flex-row px-4 mt-4 mb-4 items-center">
          <Image
            source={images.clock}
            resizeMethod="contain"
            style={{ tintColor: "black", width: 20, height: 20 }}
          />
          <Text className="font-quicksand-semibold text-lg">New Orders</Text>
        </View>

        {orders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onAccept={(id, eta) => acceptOrder(id, eta)}
            onReject={(id) => rejectOrder(id)}
            onReady={(id) => markOrderReady(id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
