import { Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router"; 
export default function Index() {
  const handlePress = () => {
    router.push("/customer/home");
  };

  return (
    <View className="flex-1 justify-center items-center">
      <TouchableOpacity
        className="bg-primary px-6 py-3 rounded-2xl"
        onPress={handlePress}
      >
        <Text className="text-white-100 font-quicksand-bold text-lg">Table no 5</Text>
      </TouchableOpacity>
    </View>
  );
}
