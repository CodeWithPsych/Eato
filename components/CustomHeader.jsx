import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react"; // <-- import useState
import CustomAlert from "./CustomAlert";
import { images } from "@/constants";

const CustomHeader = ({ title }) => {
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState(false); // <-- define state

  return (
    <>
      <View className="custom-header">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={images.arrowBack}
            className="size-6"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text className="base-semibold text-dark-100">{title}</Text>

        <TouchableOpacity onPress={() => setAlertVisible(true)}>
          <Image source={images.bell} className="size-6" resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Render CustomAlert at the root level */}
      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message="Waiter is coming to your table!"
      />
    </>
  );
};

export default CustomHeader;
