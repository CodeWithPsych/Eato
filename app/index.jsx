import { images } from "@/constants";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-[#FFF4EC] px-5">
      {/* Header */}
      <View className="flex-row justify-between items-center mt-4">
        <View>
          <Text className="text-primary text-xl font-quicksand-bold">Eato</Text>
          <Text className="text-gray-500 text-sm font-quicksand-semibold">Scan to order</Text>
        </View>

        <View className="flex-row gap-3">
          {/* Restaurant Icon */}
          <TouchableOpacity  onPress={() => router.push("/resturant")} className="w-10 h-10 rounded-full bg-white items-center justify-center">
            <Image
              source={images.restaurant}
              className="size-5"
              resizeMode="contain"
              tintColor={"#ff4c1b"}
            />
          </TouchableOpacity>

          {/* Chef / Kitchen Icon */}
          <TouchableOpacity  onPress={() => router.push("/chef")} className="w-10 h-10 rounded-full bg-white items-center justify-center">
            <Image
              source={images.chef}
               className="size-5"
              resizeMode="contain"
              tintColor={"#ff4c1b"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* QR Scanner UI */}
      <View className="flex-1 justify-center items-center">
        <View className="w-72 h-72 relative items-center justify-center">
          <View className="absolute top-0 left-0 w-10 h-10 border-l-4 border-t-4 border-primary rounded-tl-3xl" />
          <View className="absolute top-0 right-0 w-10 h-10 border-r-4 border-t-4 border-primary rounded-tr-3xl" />
          <View className="absolute bottom-0 left-0 w-10 h-10 border-l-4 border-b-4 border-primary rounded-bl-3xl" />
          <View className="absolute bottom-0 right-0 w-10 h-10 border-r-4 border-b-4 border-primary rounded-br-3xl" />

          <View className="w-32 h-32 bg-white rounded-2xl items-center justify-center shadow-md">
            <Image
              source={images.qrcode}
              className="w-20 h-20"
              resizeMode="contain"
              tintColor={"#ff4c1b"}
            />
          </View>
        </View>

        <Text className="mt-8 text-lg font-quicksand-bold">
          Scan Table QR Code
        </Text>

        <Text className="text-gray-500 text-center mt-1">
          Point your camera at the QR code on your table{"\n"}
          to start ordering
        </Text>

        <Text className="mt-6 text-gray-400 text-sm">
          Demo Mode - Click to simulate scan
        </Text>

        {/* Demo Buttons */}
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/customer/home",
              params: { table: 5 },
            })
          }
          className="bg-primary w-full py-4 rounded-2xl mt-4"
        >
          <Text className="text-white text-center font-quicksand-bold">
            Scan Table 5
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/customer/home",
              params: { table: 12 },
            })
          }
          className="bg-red-600 w-full py-4 rounded-2xl mt-3"
        >
          <Text className="text-white text-center font-quicksand-bold">
            Scan Table 12
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/owner")}
          className="bg-purple-600 w-full py-4 rounded-2xl mt-3"
        >
          <Text className="text-white text-center font-quicksand-bold">
            Owner Login
          </Text>
        </TouchableOpacity>

        <Text className="text-gray-400 text-xs mt-4">
          WiFi authentication required
        </Text>
      </View>
    </SafeAreaView>
  );
}
