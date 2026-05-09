import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { setOwnerRestaurantId } from "@/services/ownerSlice";
import { getSetupProgress, setupStep1 } from "@/services/restaurantSetupApi";

export default function RestaurantProfile() {
  const { ownerName, ownerEmail, ownerPhone } = useLocalSearchParams();
  const dispatch = useDispatch();

  const [restaurantName, setRestaurantName] = useState("");
  const [location, setLocation] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiType, setWifiType] = useState("WPA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const owner = {
    name: ownerName ?? "Owner",
    email: ownerEmail ?? "—",
    phone: ownerPhone ?? "—",
  };

  const handleContinue = async () => {
    if (!restaurantName.trim()) return;
    setLoading(true);
    setError("");
    try {
      // Step 1: save name, location, wifi
      await setupStep1({
        name: restaurantName.trim(),
        location: location.trim(),
        wifiSsid: wifiSsid.trim(),
        wifiPassword: wifiPassword.trim(),
        wifiType,
      });

      // Fetch setup progress to get the restaurantId
      const progressRes = await getSetupProgress();
      const restaurantId = progressRes.data?.data?.restaurantId;

      if (!restaurantId) throw new Error("Could not retrieve restaurant ID");

      dispatch(setOwnerRestaurantId(restaurantId));

      router.push({
        pathname: "/resturant/set_categories",
        params: { restaurantId },
      });
    } catch (err) {
      setError(err?.response?.data?.message ?? err?.message ?? "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-orange-50 px-6 pt-6"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View className="flex-row items-center mb-8">
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={images.arrowBack} className="w-6 h-6" />
        </TouchableOpacity>
        <View className="flex-row items-center ml-5 gap-2">
          <Image
            source={images.restaurant}
            className="w-6 h-6"
            tintColor="#ea580c"
          />
          <Text className="text-lg font-quicksand-bold text-neutral-800">
            Restaurant Setup
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View className="flex-row items-center justify-center mb-6">
        {[1, 2, 3, 4].map((step, i) => (
          <View key={step} className="flex-row items-center">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                step === 1 ? "bg-orange-600" : "bg-gray-300"
              }`}
            >
              <Text
                className={step === 1 ? "text-white font-bold" : "text-gray-500"}
              >
                {step}
              </Text>
            </View>
            {i < 3 && <View className="w-12 h-1 bg-gray-300 mx-2" />}
          </View>
        ))}
      </View>

      {/* Verified card */}
      <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-8 h-8 bg-green-200 rounded-full items-center justify-center">
            <Text className="text-green-700 font-bold">✓</Text>
          </View>
          <Text className="text-green-700 font-quicksand-semibold">
            Owner Verified
          </Text>
        </View>
        <Text className="text-neutral-700 text-sm">
          <Text className="font-quicksand-semibold">Owner: </Text>
          {owner.name}
        </Text>
        <Text className="text-neutral-700 text-sm">
          <Text className="font-quicksand-semibold">Email: </Text>
          {owner.email}
        </Text>
        <Text className="text-neutral-700 text-sm">
          <Text className="font-quicksand-semibold">Phone: </Text>
          {owner.phone}
        </Text>
      </View>

      {error ? (
        <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      ) : null}

      {/* Restaurant Info */}
      <Text className="text-neutral-700 mb-1 font-quicksand-medium">
        Restaurant Name *
      </Text>
      <TextInput
        value={restaurantName}
        onChangeText={setRestaurantName}
        placeholder="Enter restaurant name"
        className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4"
      />

      <Text className="text-neutral-700 mb-1 font-quicksand-medium">
        Location (optional)
      </Text>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="e.g. Lahore, DHA Phase 5"
        className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6"
      />

      {/* WiFi Section */}
      <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <Text className="text-blue-700 font-quicksand-semibold mb-3">
          📶 WiFi Credentials (optional)
        </Text>
        <Text className="text-neutral-600 text-xs mb-3">
          These will be embedded in QR codes so customers auto-connect on scan.
        </Text>

        <Text className="text-neutral-700 mb-1 text-sm font-quicksand-medium">
          WiFi Network Name (SSID)
        </Text>
        <TextInput
          value={wifiSsid}
          onChangeText={setWifiSsid}
          placeholder="e.g. RestaurantWiFi"
          autoCapitalize="none"
          className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-3"
        />

        <Text className="text-neutral-700 mb-1 text-sm font-quicksand-medium">
          WiFi Password
        </Text>
        <TextInput
          value={wifiPassword}
          onChangeText={setWifiPassword}
          placeholder="WiFi password"
          secureTextEntry
          autoCapitalize="none"
          className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-3"
        />

        <Text className="text-neutral-700 mb-2 text-sm font-quicksand-medium">
          Security Type
        </Text>
        <View className="flex-row gap-2">
          {["WPA", "WEP", "nopass"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setWifiType(type)}
              className={`px-4 py-2 rounded-full ${
                wifiType === type
                  ? "bg-blue-600"
                  : "bg-white border border-gray-200"
              }`}
            >
              <Text
                className={`text-sm ${
                  wifiType === type ? "text-white" : "text-neutral-700"
                }`}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        disabled={!restaurantName.trim() || loading}
        onPress={handleContinue}
        className={`py-4 rounded-xl ${
          restaurantName.trim() && !loading ? "bg-orange-600" : "bg-gray-300"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-quicksand-bold">
            Continue to Categories →
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}