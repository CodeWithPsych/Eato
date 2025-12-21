import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function OrderCard({ order, onAccept, onReject, onReady }) {
  const [eta, setEta] = useState(order.eta || "15");

  return (
    <View className="bg-white rounded-2xl border border-orange-200 overflow-hidden mb-4">
      <View className="bg-orange-50 px-4 py-3 flex-row justify-between items-center">
        <View>
          <Text className="font-semibold text-gray-800">Table {order.tableNumber}</Text>
          <Text className="text-xs text-gray-500">{order.time}</Text>
        </View>
        <Text className="text-orange-600 font-semibold">Rs: {order.total.toFixed(2)}</Text>
      </View>

      <View className="px-4 py-3">
        {order.items.map((item, index) => (
          <Text key={index} className="text-gray-700 mb-1">
            {item.quantity}x {item.name}
          </Text>
        ))}

        <Text className="text-gray-600 text-sm mb-2">
          Estimated preparation time (minutes):
        </Text>
        <TextInput
          value={eta}
          onChangeText={setEta}
          keyboardType="numeric"
          className="border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 mb-4"
        />

        <View className="flex-row gap-3">
          {order.status === "pending" ? (
            <>
              <TouchableOpacity
                className="flex-1 bg-red-100 py-3 rounded-xl items-center"
                onPress={() => onReject(order.id)}
              >
                <Text className="text-red-600 font-semibold">Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-green-600 py-3 rounded-xl items-center"
                onPress={() => onAccept(order.id, eta)}
              >
                <Text className="text-white font-semibold">Accept</Text>
              </TouchableOpacity>
            </>
          ) : order.status === "accepted" ? (
            <TouchableOpacity
              className="flex-1 bg-blue-600 py-3 rounded-xl items-center"
              onPress={() => onReady(order.id)}
            >
              <Text className="text-white font-quicksand-semibold bg-green-600 rounded-xl px-4 py-2">Mark as Ready</Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-gray-500 font-quicksand-medium text-center py-3">Order Ready</Text>
          )}
        </View>
      </View>
    </View>
  );
}
