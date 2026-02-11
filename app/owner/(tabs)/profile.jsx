import { images } from "@/constants";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const showComingSoon = () => {
    Alert.alert(
      "Coming Soon 🚀",
      "This feature is currently under development and will be available soon.",
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-neutral-50 px-4 pt-6 pb-24"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Text className="text-lg font-quicksand-semibold text-neutral-800 mb-4">
        Profile Settings
      </Text>

      {/* Restaurant Information */}
      <View className="bg-white rounded-2xl p-4 mb-4 border border-neutral-100">
        <View className="flex-row items-center mb-3">
          <Image source={images.restaurant} className="w-5 h-5 mr-2" />
          <Text className="text-neutral-800 font-quicksand-semibold">
            Restaurant Information
          </Text>
        </View>

        <Text className="text-neutral-600 mb-2">Restaurant Name</Text>

        <TextInput
          value="The Golden Spoon"
          className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-3"
        />

        <TouchableOpacity
          onPress={showComingSoon}
          className="bg-purple-600 py-3 rounded-xl"
        >
          <Text className="text-white text-center font-quicksand-medium">
            Update Restaurant Name
          </Text>
        </TouchableOpacity>
      </View>

      {/* Change Password */}
      <View className="bg-white rounded-2xl p-4 mb-4 border border-neutral-100">
        <View className="flex-row items-center mb-3">
          <Image source={images.lock} className="w-5 h-5 mr-2" />
          <Text className="text-neutral-800 font-quicksand-semibold">
            Change Password
          </Text>
        </View>

        <Text className="text-neutral-600 mb-2">Current Password</Text>
        <View className="relative mb-3">
          <TextInput
            placeholder="Enter current password"
            secureTextEntry
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3"
          />
          <Image
            source={images.hide}
            className="w-5 h-5 absolute right-4 top-3.5"
          />
        </View>

        <Text className="text-neutral-600 mb-2">New Password</Text>
        <View className="relative mb-3">
          <TextInput
            placeholder="Enter new password"
            secureTextEntry
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3"
          />
          <Image
            source={images.hide}
            className="w-5 h-5 absolute right-4 top-3.5"
          />
        </View>

        <Text className="text-neutral-600 mb-2">Confirm New Password</Text>
        <View className="relative mb-3">
          <TextInput
            placeholder="Confirm new password"
            secureTextEntry
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3"
          />
          <Image
            source={images.hide}
            className="w-5 h-5 absolute right-4 top-3.5"
          />
        </View>

        <TouchableOpacity
          onPress={showComingSoon}
          className="bg-purple-600 py-3 rounded-xl"
        >
          <Text className="text-white text-center font-quicksand-medium">
            Update Password
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chef Accounts */}
      <View className="bg-white rounded-2xl p-4 border border-neutral-100">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Image source={images.chef} className="w-5 h-5 mr-2" />
            <Text className="text-neutral-800 font-quicksand-semibold">
              Chef Accounts
            </Text>
          </View>

          <TouchableOpacity
            onPress={showComingSoon}
            className="flex-row items-center bg-purple-600 px-3 py-2 rounded-lg"
          >
            <Image source={images.plus} className="w-4 h-4 mr-1 tint-white" />
            <Text className="text-white text-sm">Add Chef</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 mb-3">
          <View className="flex-row justify-between">
            <View>
              <Text className="text-neutral-800 font-quicksand-medium">Chef Ahmed</Text>
              <Text className="text-neutral-500 text-sm">@chef001</Text>
            </View>

            <TouchableOpacity onPress={showComingSoon}>
              <Image source={images.trash} className="w-5 h-5 tint-red-500" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mt-2">
            <Text className="text-neutral-600 text-sm mr-2">Password:</Text>

            <View className="flex-1 bg-white border border-neutral-200 rounded-md px-3 py-1">
              <Text className="text-neutral-800 text-sm">••••••••</Text>
            </View>

            <TouchableOpacity onPress={showComingSoon}>
              <Image source={images.visible} className="w-4 h-4 ml-2" />
            </TouchableOpacity>
          </View>

          <Text className="text-neutral-400 text-xs mt-2">
            Created: 2024-01-15
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
