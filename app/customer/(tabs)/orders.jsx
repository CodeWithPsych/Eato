import { Text, View, Image, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrdersStore } from "@/store/orders.store";
import { images } from "@/constants";
import CustomHeader from "@/components/CustomHeader"; // import CustomHeader

const Orders = () => {
  const { orders, markOrderReady } = useOrdersStore();

  const renderOrder = ({ item: order }) => {
    const statusIcon =
      order.status === "pending"
        ? images.clock
        : order.status === "accepted"
        ? images.clock
        : images.check;

    const statusText =
      order.status === "pending"
        ? "Pending"
        : order.status === "accepted"
        ? "Preparing"
        : "Ready";

    return (
      <View className="bg-white rounded-2xl p-4 mb-4 border-2 border-gray-200">
        <View className="flex-between flex-row mb-2">
          <View className="flex-row items-center gap-2">
            <Image
              source={statusIcon}
              className="size-5"
              resizeMode="contain"
            />
            <Text className="font-quicksand-bold text-dark-100">
              {statusText}
            </Text>
          </View>
          <Text className="text-dark-100">Table {order.tableNumber}</Text>
        </View>

        {/* Order Items */}
        <View className="mb-2">
          {order.items.map((item, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center mb-1"
            >
              <Text className="text-dark-100">
                {item.name} x{item.quantity}
              </Text>
              <Text className="text-dark-100">
                Rs {item.price * item.quantity}
              </Text>
            </View>
          ))}
        </View>

        {/* Order Total */}
        <View className="border-t border-gray-200 pt-2">
          <View className="flex-row justify-between mb-1">
            <Text className="text-dark-100">Subtotal</Text>
            <Text className="text-dark-100">
              Rs {order.subtotal.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-dark-100">GST</Text>
            <Text className="text-dark-100">Rs {4.5}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-quicksand-bold text-dark-100">Total</Text>
            <Text className="font-quicksand-bold text-orange-500">
              Rs {order.total.toFixed(2)}
            </Text>
          </View>
        </View>

      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-100">
      <View className="flex-1 px-5 pt-5">
        <CustomHeader title="Your Orders" />
        {orders.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              top: -130,
            }}
          >
            <Image
              source={images.emptyState} // your empty state image
              style={{
                width: 200,
                height: 200,
                resizeMode: "contain",
              }}
            />
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#333" }}>
              No Orders Yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderOrder}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Orders;
