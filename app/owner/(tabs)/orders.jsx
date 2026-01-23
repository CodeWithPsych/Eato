import { View, Text, ScrollView, TextInput } from "react-native";

export default function Orders() {
  return (
    <ScrollView className="flex-1 bg-neutral-50 px-4 pt-6">
      <TextInput
        placeholder="Search by order ID or table..."
        className="bg-white rounded-xl px-4 py-3 mb-4"
      />

      <View className="bg-green-100 rounded-xl p-4 mb-3">
        <Text className="font-semibold">ORD001 • Served</Text>
        <Text className="text-sm">Table 5 • Rs 837</Text>
      </View>

      <View className="bg-orange-100 rounded-xl p-4 mb-3">
        <Text className="font-semibold">ORD003 • Pending</Text>
        <Text className="text-sm">Table 8 • Rs 1130</Text>
      </View>
    </ScrollView>
  );
}
