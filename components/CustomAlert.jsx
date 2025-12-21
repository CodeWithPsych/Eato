import { View, Text, TouchableOpacity, Modal } from "react-native";
import cn from "clsx";

const CustomAlert = ({ visible, onClose, message }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-5 w-4/5 shadow-lg">
          <Text className="font-quicksand-bold text-center text-xl text-dark-100 mb-3">
            {message}
          </Text>

          <TouchableOpacity
            className="bg-orange-500 rounded-xl py-2 mt-2"
            onPress={onClose}
          >
            <Text className="text-white-100 text-center font-quicksand-semibold">
              Okay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
