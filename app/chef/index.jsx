import CustomAlert from "@/components/CustomAlert";
import { images } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KitchenLogin() {
  const [kitchenId, setKitchenId] = useState("");
  const [password, setPassword] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleLogin = () => {
    if (!kitchenId.trim() || !password.trim()) {
      setAlertMessage("Please fill both Kitchen ID and Password");
      setAlertVisible(true);
      return;
    }
    router.push("/chef/dashboard");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#ECFDF5] justify-center px-6">
      {/* ✅ CUSTOM HEADER (does NOT affect existing layout) */}
      <View className="absolute top-0 left-0 right-0 bg-white px-4 py-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={images.arrowBack}
            className="size-6"
            tintColor="#16a34a"
          />
        </TouchableOpacity>

        <Text className="text-green-600 text-lg font-quicksand-semibold">
          Kitchen Login
        </Text>

        <Image source={images.chef} className="size-6" tintColor="#16a34a" />
      </View>

      {/* Card (UNCHANGED) */}
      <View className="bg-white rounded-3xl p-6 shadow-lg">
        <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center self-center mb-4">
          <Image
            source={images.kitchen}
            style={{ width: 40, height: 40 }}
            tintColor="#16a34a"
          />
        </View>

        <Text className="text-center text-xl font-quicksand-bold mb-6">
          Kitchen Access
        </Text>

        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-quicksand-medium">Kitchen ID</Text>
          <TextInput
            value={kitchenId}
            onChangeText={setKitchenId}
            placeholder="Enter kitchen ID"
            className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-quicksand-medium">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
            className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-green-600 py-4 rounded-xl"
        >
          <Text className="text-white text-center font-quicksand-semibold">
            Login to Kitchen
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-400 text-xs mt-4 font-quicksand-medium">
          Demo: Use any ID and password
        </Text>
      </View>

      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message={alertMessage}
        buttonColor="#02a034"
      />
    </SafeAreaView>
  );
}
