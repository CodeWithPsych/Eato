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
  Alert,
} from "react-native";
import { setupStep4, completeSetup } from "@/services/restaurantSetupApi";

export default function SetTables() {
  const { restaurantId } = useLocalSearchParams();
  const [tableCount, setTableCount] = useState("");
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    const count = parseInt(tableCount, 10);
    if (!count || count < 1 || count > 100) {
      Alert.alert("Invalid", "Please enter a number between 1 and 100");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await setupStep4(count);
      const tableData = res.data?.data?.tables ?? [];
      setTables(tableData);
      setGenerated(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ?? err?.message ?? "Failed to generate QR codes"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    setError("");
    try {
      await completeSetup();
      Alert.alert(
        "🎉 Restaurant is Live!",
        "Your restaurant setup is complete. Customers can now scan your QR codes to order.",
        [
          {
            text: "Go to Dashboard",
            onPress: () => router.replace("/owner/(tabs)/dashboard"),
          },
        ]
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ?? err?.message ?? "Failed to complete setup"
      );
    } finally {
      setCompleting(false);
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
      <View className="flex-row items-center justify-center mb-8">
        {[true, true, true, false].map((done, i) => (
          <View key={i} className="flex-row items-center">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                done
                  ? "bg-green-500"
                  : i === 3
                  ? "bg-orange-600"
                  : "bg-gray-300"
              }`}
            >
              <Text
                className={
                  done || i === 3 ? "text-white font-bold" : "text-gray-500"
                }
              >
                {i + 1}
              </Text>
            </View>
            {i < 3 && (
              <View
                className={`w-12 h-1 mx-2 ${
                  done ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </View>
        ))}
      </View>

      <Text className="text-neutral-600 text-sm mb-4">
        Enter your number of tables to generate unique QR codes with embedded
        restaurant info and WiFi credentials.
      </Text>

      {error ? (
        <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      ) : null}

      <Text className="text-neutral-700 mb-2 font-quicksand-medium">
        Number of Tables *
      </Text>
      <TextInput
        value={tableCount}
        onChangeText={setTableCount}
        keyboardType="number-pad"
        placeholder="Enter number of tables"
        className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4"
        editable={!generated}
      />

      {!generated && (
        <TouchableOpacity
          disabled={!tableCount || loading}
          onPress={handleGenerate}
          className={`py-4 rounded-xl mb-6 ${
            !tableCount || loading ? "bg-gray-300" : "bg-orange-600"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-quicksand-semibold">
              Generate QR Codes
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* Generated QR list */}
      {generated && tables.length > 0 && (
        <View className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-quicksand-semibold text-neutral-800">
              ✅ {tables.length} QR Codes Generated
            </Text>
          </View>

          <View className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
            <Text className="text-blue-700 text-xs font-quicksand-medium">
              Each QR code contains your restaurant ID, table number, and WiFi
              credentials. Customers scan these to start ordering.
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {tables.slice(0, 20).map((t) => (
              <View
                key={t.tableNumber}
                className="bg-orange-50 border border-orange-200 w-24 h-28 rounded-xl items-center justify-center"
              >
                <Image
                  source={images.qrcode}
                  className="w-14 h-14"
                  tintColor="#ff4c1b"
                />
                <Text className="text-sm mt-1 font-quicksand-medium text-neutral-700">
                  Table {t.tableNumber}
                </Text>
                <View
                  className={`w-2 h-2 rounded-full mt-1 ${
                    t.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </View>
            ))}
            {tables.length > 20 && (
              <View className="w-24 h-28 rounded-xl items-center justify-center bg-neutral-100">
                <Text className="text-neutral-500 text-sm text-center">
                  +{tables.length - 20} more
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Action buttons */}
      <View className="flex-row gap-3 mb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 bg-neutral-200 py-3 rounded-xl"
        >
          <Text className="text-center text-neutral-700">Back</Text>
        </TouchableOpacity>

        {generated && (
          <TouchableOpacity
            onPress={handleComplete}
            disabled={completing}
            className={`flex-1 py-3 rounded-xl ${
              completing ? "bg-green-400" : "bg-green-600"
            }`}
          >
            {completing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-quicksand-semibold">
                Complete Setup 🚀
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}