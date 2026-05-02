import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function OrderCard({ order = {}, onAccept, onReject, onReady }) {
  // ✅ Normalize values (VERY IMPORTANT)
  const orderId = order?.orderId ?? order?.id ?? "";
  const items = order?.items ?? [];
  const status = (order?.status ?? "").toLowerCase();

  // ✅ Safe total
  const total = Number(order?.totalAmount ?? order?.total ?? 0);

  // ✅ Safe ETA
  const [eta, setEta] = useState(String(order?.eta ?? "15"));

  return (
    <View className="bg-white rounded-2xl border border-orange-200 overflow-hidden mb-4">
      {/* Header */}
      <View className="bg-orange-50 px-4 py-3 flex-row justify-between items-center">
        <View>
          <Text className="font-semibold text-gray-800">
            Table {order?.tableNumber ?? "--"}
          </Text>
          <Text className="text-xs text-gray-500">
            {order?.time ?? order?.date ?? ""}
          </Text>
        </View>

        {/* ✅ SAFE PRICE */}
        <Text className="text-orange-600 font-semibold">
          Rs: {total.toFixed(2)}
        </Text>
      </View>

      {/* Body */}
      <View className="px-4 py-3">
        {/* Items */}
        {items.length > 0 ? (
          items.map((item, index) => {
            const qty = Number(item?.quantity ?? 0);
            const name = item?.name ?? "Item";

            return (
              <Text key={index} className="text-gray-700 mb-1">
                {qty}x {name}
              </Text>
            );
          })
        ) : (
          <Text className="text-gray-400 mb-2">No items</Text>
        )}

        {/* ETA */}
        <Text className="text-gray-600 text-sm mb-2">
          Estimated preparation time (minutes):
        </Text>

        <TextInput
          value={eta}
          onChangeText={setEta}
          keyboardType="numeric"
          className="border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 mb-4"
        />

        {/* Actions */}
        <View className="flex-row gap-3">
          {/* Pending */}
          {status === "pending" && (
            <>
              <TouchableOpacity
                className="flex-1 bg-red-100 py-3 rounded-xl items-center"
                onPress={() => onReject?.(orderId)}
              >
                <Text className="text-red-600 font-semibold">Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-green-600 py-3 rounded-xl items-center"
                onPress={() => onAccept?.(orderId, eta)}
              >
                <Text className="text-white font-semibold">Accept</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Accepted */}
          {status === "accepted" && (
            <TouchableOpacity
              className="flex-1 bg-blue-600 py-3 rounded-xl items-center"
              onPress={() => onReady?.(orderId)}
            >
              <Text className="text-white font-semibold">Mark as Ready</Text>
            </TouchableOpacity>
          )}

          {/* Ready / Delivered */}
          {["ready", "delivered"].includes(status) && (
            <Text className="text-gray-500 text-center w-full py-3">
              Order Ready
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
