import cn from "clsx";
import  { useState } from "react";
import { Text, TextInput, View } from "react-native";

const CustomInput = ({
  placeholder = "Enter Text",
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && <Text className="mb-1 text-gray-700 text-sm">{label}</Text>}

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#888"
        className={cn(
          "rounded-none border-b-2 pb-2", 
          isFocused ? "border-primary" : "border-gray-300"
        )}
      />
    </View>
  );
};

export default CustomInput;
