import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";

export default function SetTables() {
  const { restaurantId } = useLocalSearchParams();
  const [tableCount,   setTableCount]   = useState("");
  const [showQRCodes,  setShowQRCodes]  = useState(false);

  return (
    <ScrollView className="flex-1 bg-orange-50 px-6 pt-6">
      {/* Header */}
      <View className="flex-row items-center mb-12">
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={images.arrowBack} className="w-6 h-6" />
        </TouchableOpacity>
        <View className="flex-row items-center ml-5 gap-2">
          <Image source={images.restaurant} className="w-6 h-6" tintColor="#ea580c" />
          <Text className="text-lg font-quicksand-bold text-neutral-800">Restaurant Setup</Text>
        </View>
      </View>

      {/* Progress */}
      <View className="flex-row items-center justify-center mb-8">
        {[true, true, true, false].map((done, i) => (
          <View key={i} className="flex-row items-center">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                done ? "bg-green-500" : i === 3 ? "bg-orange-600" : "bg-gray-300"
              }`}
            >
              <Text className={done || i === 3 ? "text-white font-bold" : "text-gray-500"}>
                {i + 1}
              </Text>
            </View>
            {i < 3 && (
              <View className={`w-12 h-1 mx-2 ${done ? "bg-green-500" : "bg-gray-300"}`} />
            )}
          </View>
        ))}
      </View>

      <Text className="text-neutral-700 mb-2 font-quicksand-medium">Number of Tables</Text>

      <TextInput
        value={tableCount}
        onChangeText={setTableCount}
        keyboardType="number-pad"
        placeholder="Enter number of tables"
        className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4"
      />

      {showQRCodes && !!tableCount && (
        <View className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between mb-4">
            <Text className="font-quicksand-semibold text-neutral-800">
              Generated QR Codes
            </Text>
            <TouchableOpacity>
              <Image source={images.download} className="w-5 h-5" />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {Array.from({ length: +tableCount }, (_, i) => (
              <View
                key={i}
                className="bg-neutral-50 w-24 h-28 rounded-xl items-center justify-center"
              >
                <Image source={images.qrcode} className="w-16 h-16" tintColor="#ff4c1b" />
                <Text className="text-sm mt-1 font-quicksand-medium">Table {i + 1}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="flex-row gap-3">
        <TouchableOpacity onPress={() => router.back()} className="flex-1 bg-neutral-200 py-3 rounded-xl">
          <Text className="text-center text-neutral-700">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowQRCodes(true)}
          disabled={!tableCount}
          className={`flex-1 py-3 rounded-xl ${!tableCount ? "bg-neutral-300" : "bg-orange-600"}`}
        >
          <Text className="text-white text-center">Generate QR Codes</Text>
        </TouchableOpacity>
      </View>

      {showQRCodes && (
        <TouchableOpacity
          onPress={() => router.replace("/owner")}
          className="mt-4 mb-8 bg-green-600 py-3 rounded-xl"
        >
          <Text className="text-white text-center font-quicksand-semibold">
            Complete Setup → Go to Dashboard
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}