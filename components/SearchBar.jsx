import { images } from "@/constants";
import { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  return (
    <View className="flex-row items-center bg-orange-50 rounded-3xl border-2 border-orange-200 px-3 py-2 mb-5 ">
      <TextInput
        className="flex-1 text-base  px-2 text-black"
        placeholder="Search for food items..."
        placeholderTextColor="#A0A0A0"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
      />

      {/* Search Icon */}
      <TouchableOpacity className="ml-2">
        <Image
          source={images.search}
          className="w-6 h-6"
          resizeMode="contain"
          tintColor="#5D5F6D"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
