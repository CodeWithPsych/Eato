import { Modal, Text, TouchableOpacity, View } from "react-native";

const CustomAlert = ({ visible, onClose, message, buttonColor = "#ff4c1b" }) => {

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-5 w-4/5 shadow-lg">
          <Text className="font-quicksand-medium text-center text-lg text-dark-100 mb-3">
            {message}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            style={{ backgroundColor: buttonColor }}
            className="rounded-xl py-2 mt-2"
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
