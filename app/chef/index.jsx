import CustomAlert from "@/components/CustomAlert";
import { images } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { chefLoginAsync, selectChefAuthStatus, selectChefError } from "@/services/chefSlice";

export default function KitchenLogin() {
  const dispatch   = useDispatch();
  const authStatus = useSelector(selectChefAuthStatus);
  const authError  = useSelector(selectChefError);

  const [kitchenId, setKitchenId] = useState("");
  const [password,  setPassword]  = useState("");
  const [alertMsg,  setAlertMsg]  = useState("");
  const [alertVis,  setAlertVis]  = useState(false);

  const handleLogin = async () => {
    if (!kitchenId.trim() || !password.trim()) {
      setAlertMsg("Please fill both Kitchen ID and Password");
      setAlertVis(true);
      return;
    }
    const result = await dispatch(chefLoginAsync({ kitchenId: kitchenId.trim(), password }));
    if (chefLoginAsync.fulfilled.match(result)) {
      router.push("/chef/dashboard");
    }
  };

  const isLoading = authStatus === "loading";

  return (
    <SafeAreaView className="flex-1 bg-[#ECFDF5] justify-center px-6">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 bg-white px-4 py-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={images.arrowBack} className="size-6" tintColor="#16a34a" />
        </TouchableOpacity>
        <Text className="text-green-600 text-lg font-quicksand-semibold">Kitchen Login</Text>
        <Image source={images.chef} className="size-6" tintColor="#16a34a" />
      </View>

      {/* Card */}
      <View className="bg-white rounded-3xl p-6 shadow-lg">
        <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center self-center mb-4">
          <Image source={images.kitchen} style={{ width: 40, height: 40 }} tintColor="#16a34a" />
        </View>

        <Text className="text-center text-xl font-quicksand-bold mb-6">Kitchen Access</Text>

        {/* Error */}
        {authError ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <Text className="text-red-600 text-sm text-center">{authError}</Text>
          </View>
        ) : null}

        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-quicksand-medium">Kitchen ID</Text>
          <TextInput
            value={kitchenId}
            onChangeText={setKitchenId}
            placeholder="Enter kitchen ID"
            autoCapitalize="none"
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
          disabled={isLoading}
          className={`py-4 rounded-xl ${isLoading ? "bg-green-400" : "bg-green-600"}`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-quicksand-semibold">
              Login to Kitchen
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={alertVis}
        onClose={() => setAlertVis(false)}
        message={alertMsg}
        buttonColor="#02a034"
      />
    </SafeAreaView>
  );
}