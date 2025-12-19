import { Text,View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  
  return (
     <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="font-quicksand-bold text-3xl">Search Section</Text>
        </View>
      </SafeAreaView>
  );
};

export default Search;
