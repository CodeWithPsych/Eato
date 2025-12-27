import { images } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SetTables() {
  const [tableCount, setTableCount] = useState("");
  const [showQRCodes, setShowQRCodes] = useState(false);

  const generateTables = () => {
    setShowQRCodes(true);
  };

  return (
    <View className="flex-1 bg-orange-50 px-6 py-6">
      {/* Progress bar */}
      <View className="flex-row justify-between mb-4">
        <View className="w-4 h-4 bg-green-500 rounded-full" />
        <View className="w-4 h-4 bg-green-500 rounded-full" />
        <View className="w-4 h-4 bg-green-500 rounded-full" />
        <View className="w-4 h-4 bg-orange-500 rounded-full" />
      </View>

      <Text className="mb-2 text-neutral-700 text-lg font-medium">Number of Tables</Text>
      <TextInput
        value={tableCount}
        onChangeText={setTableCount}
        keyboardType="number-pad"
        placeholder="Enter number of tables"
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 bg-white text-base"
      />

      {showQRCodes && tableCount && parseInt(tableCount) > 0 && (
        <View className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
          <View className="flex-row justify-between mb-4">
            <Text className="text-neutral-800 font-medium">Generated QR Codes</Text>
            <TouchableOpacity>
              <Image source={images.download} className="w-6 h-6" />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {Array.from({ length: parseInt(tableCount) }, (_, i) => (
              <View
                key={i}
                className="bg-white w-20 h-28 rounded-xl items-center justify-center mb-3 p-2 shadow-sm"
              >
                <Image
                  source={images.qrcode}
                  className="w-20 h-20"
                  resizeMode="contain"
                  tintColor="#ff4c1b"
                />
                <Text className="text-sm text-neutral-700 mt-1">Table {i + 1}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="flex-row gap-3 mt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 bg-gray-300 py-3 rounded-xl"
        >
          <Text className="text-center text-neutral-700 font-medium">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={generateTables}
          disabled={!tableCount || parseInt(tableCount) < 1}
          className={`flex-1 py-3 rounded-xl ${
            !tableCount || parseInt(tableCount) < 1 ? "bg-gray-300" : "bg-orange-600"
          }`}
        >
          <Text className="text-white text-center font-medium">Generate QR Codes</Text>
        </TouchableOpacity>
      </View>

      {showQRCodes && (
        <TouchableOpacity
          onPress={() => router.push("/dashboard")}
          className="mt-4 flex-1 bg-green-600 py-3 rounded-xl"
        >
          <Text className="text-white text-center font-medium">Complete Setup</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
