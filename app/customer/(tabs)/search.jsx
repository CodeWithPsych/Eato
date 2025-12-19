import SearchBar from "@/components/SearchBar";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const data = []; // Replace with search results

  return (
    <SafeAreaView className="flex-1 bg-white px-5 pt-5">
      {/* Header */}
      <View className="mb-5">
        <Text className="uppercase text-primary font-quicksand-bold text-lg">
          Menu
        </Text>
        <Text className="text-dark-100 font-quicksand-semibold mt-1">
          Find your favourite food
        </Text>
      </View>

   <SearchBar/>

      {/* Search Results */}
      {data.length === 0 ? (
        <Text className="text-center mt-10 text-gray-500">
          No Results Found!
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <View className="mb-4 bg-gray-100 p-4 rounded-lg">
              <Text className="text-neutral-800">{item.name}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </SafeAreaView>
  );
};

export default Search;
