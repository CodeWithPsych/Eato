import { View, Text, ScrollView, TextInput } from "react-native";

export default function Profile() {
  return (
    <ScrollView className="flex-1 bg-neutral-50 px-4 pt-6">
      <Text className="font-bold mb-2">Restaurant Information</Text>
      <TextInput
        className="bg-white rounded-xl px-4 py-3 mb-4"
        value="The Golden Spoon"
      />

      <Text className="font-bold mb-2">Change Password</Text>
      <TextInput placeholder="Current password" className="bg-white rounded-xl px-4 py-3 mb-2" />
      <TextInput placeholder="New password" className="bg-white rounded-xl px-4 py-3 mb-2" />
    </ScrollView>
  );
}
