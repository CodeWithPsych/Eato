import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";

const Cart = () => {
  return (
    <SafeAreaView className="flex-1 bg-orange-100">
      <View className="flex-1 justify-center items-center">
        <Text className="font-quicksand-bold text-3xl">Cart Section</Text>
      </View>
    </SafeAreaView>
  );
};

export default Cart;
