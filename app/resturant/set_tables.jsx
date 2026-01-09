import { images } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SetTables() {
  const [tableCount, setTableCount] = useState("");
  const [showQRCodes, setShowQRCodes] = useState(false);

  return (
    <View className="flex-1 bg-orange-50 px-6 pt-6">

      {/* HEADER */}
      <View className="flex-row items-center mb-12">
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={images.arrowBack} className="w-6 h-6"  />
        </TouchableOpacity>

        <View className="flex-row items-center ml-5 gap-2">
          <Image source={images.restaurant} className="w-6 h-6" tintColor="#ea580c" />
          <Text className="text-lg font-quicksand-bold text-neutral-800">
            Restaurant Setup
          </Text>
        </View>
      </View>

      {/* PROGRESS */}
     <View className="flex-row items-center justify-center mb-8">
        <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
          <Text className="text-white font-bold">1</Text>
        </View>
        <View className="w-12 h-1 bg-green-500 mx-2" />
        <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
          <Text className="text-white font-bold">2</Text>
        </View>
        <View className="w-12 h-1 bg-green-500 mx-2" />
        <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
          <Text className="text-white font-bold">3</Text>
        </View>
        <View className="w-12 h-1 bg-green-500 mx-2" />
        <View className="w-8 h-8 bg-orange-600 rounded-full items-center justify-center">
          <Text className="text-white font-bold">4</Text>
        </View>
      </View>
      {/* CONTENT */}
      <View className="flex-1 ">

        <Text className="text-neutral-700 mb-2">
          Number of Tables
        </Text>

        <TextInput
          value={tableCount}
          onChangeText={setTableCount}
          keyboardType="number-pad"
          placeholder="Enter number of tables"
          className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4"
        />

        {showQRCodes && tableCount && (
          <View className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <View className="flex-row justify-between mb-4">
              <Text className="font-medium text-neutral-800">
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
                  <Image
                    source={images.qrcode}
                    className="w-16 h-16"
                    tintColor="#ff4c1b"
                  />
                  <Text className="text-sm mt-1">
                    Table {i + 1}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-neutral-200 py-3 rounded-xl"
          >
            <Text className="text-center text-neutral-700">Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowQRCodes(true)}
            disabled={!tableCount}
            className={`flex-1 py-3 rounded-xl ${
              !tableCount
                ? "bg-neutral-300"
                : "bg-orange-600"
            }`}
          >
            <Text className="text-white text-center">
              Generate QR Codes
            </Text>
          </TouchableOpacity>
        </View>

        {showQRCodes && (
          <TouchableOpacity
            onPress={() => router.push("/dashboard")}
            className="mt-4 bg-green-600 py-3 rounded-xl"
          >
            <Text className="text-white text-center">
              Complete Setup
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
