import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function OrderCard({ order = {}, onAccept, onReject, onReady }) {
  // ✅ Backend uses _id; frontend JSON data uses id/orderId
  const orderId = order?._id ?? order?.orderId ?? order?.id ?? "";
  const items = order?.items ?? [];
  const status = (order?.status ?? "").toLowerCase();
  const total = Number(order?.totalAmount ?? order?.total ?? 0);

  const [eta, setEta] = useState(
    order?.eta ? String(order.eta) : "15"
  );

  const statusColor = () => {
    switch (status) {
      case "pending": return "bg-orange-50 border-orange-300";
      case "accepted": return "bg-blue-50 border-blue-300";
      case "ready": return "bg-green-50 border-green-300";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const statusBadgeColor = () => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-700";
      case "accepted": return "bg-blue-100 text-blue-700";
      case "ready": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <View className={`rounded-2xl border-2 overflow-hidden mb-4 ${statusColor()}`}>
      {/* Header */}
      <View className="px-4 py-3 flex-row justify-between items-center border-b border-neutral-200">
        <View>
          <Text className="font-semibold text-gray-800">
            Table {order?.tableNumber ?? "--"}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {order?.time ?? order?.date ?? ""}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <View className={`px-2 py-1 rounded-full ${statusBadgeColor()}`}>
            <Text className="text-xs font-quicksand-semibold capitalize">
              {status || "—"}
            </Text>
          </View>
          <Text className="text-orange-600 font-semibold">
            Rs {total.toFixed(0)}
          </Text>
        </View>
      </View>

      {/* Items */}
      <View className="px-4 py-3">
        {items.length > 0 ? (
          items.map((item, index) => {
            const qty = Number(item?.quantity ?? 0);
            const name = item?.name ?? "Item";
            const price = Number(item?.price ?? 0);

            return (
              <View
                key={index}
                className="flex-row justify-between items-center mb-1"
              >
                <Text className="text-gray-700 flex-1">
                  {qty}× {name}
                </Text>
                <Text className="text-gray-500 text-sm">
                  Rs {(qty * price).toFixed(0)}
                </Text>
              </View>
            );
          })
        ) : (
          <Text className="text-gray-400 mb-2">No items</Text>
        )}

        {/* ETA input — only relevant when pending (to be sent on accept) */}
        {status === "pending" && (
          <View className="mt-3">
            <Text className="text-gray-600 text-sm mb-1">
              Estimated time (minutes):
            </Text>
            <TextInput
              value={eta}
              onChangeText={setEta}
              keyboardType="numeric"
              className="border border-gray-200 rounded-xl px-4 py-2 bg-white text-sm"
              placeholder="15"
            />
          </View>
        )}

        {/* ETA display when accepted */}
        {status === "accepted" && order?.eta ? (
          <View className="mt-3 bg-blue-100 rounded-xl px-3 py-2">
            <Text className="text-blue-700 text-sm text-center">
              ⏱ ETA: {order.eta} min
            </Text>
          </View>
        ) : null}

        {/* Actions */}
        <View className="flex-row gap-3 mt-4">
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
                onPress={() => {
                  const etaNum = parseInt(eta, 10);
                  onAccept?.(orderId, isNaN(etaNum) ? 15 : etaNum);
                }}
              >
                <Text className="text-white font-semibold">Accept</Text>
              </TouchableOpacity>
            </>
          )}

          {status === "accepted" && (
            <TouchableOpacity
              className="flex-1 bg-blue-600 py-3 rounded-xl items-center"
              onPress={() => onReady?.(orderId)}
            >
              <Text className="text-white font-semibold">Mark as Ready</Text>
            </TouchableOpacity>
          )}

          {["ready", "delivered", "served"].includes(status) && (
            <View className="flex-1 bg-green-100 py-3 rounded-xl items-center">
              <Text className="text-green-700 font-semibold">✓ Order Ready</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}