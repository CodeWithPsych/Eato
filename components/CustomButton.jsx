import cn from "clsx";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const CustomButton = ({
  onPress,
  title = "Click Me",
  style,
  textStyle = "",
  LeftIcon,
  IsLoading = false,
}) => {
  return (
    <TouchableOpacity className={cn("custom-btn", style)} onPress={onPress}>
      <View className="flex-center flex-row">
        {IsLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text className={cn("text-white-100 paragraph-semibold", textStyle)}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
