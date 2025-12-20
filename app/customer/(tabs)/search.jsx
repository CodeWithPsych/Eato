import SearchBar from "@/components/SearchBar";
import Filter from "@/components/Filter";
import MenuCart from "@/components/MenuCart";
import CartButton from "@/components/CartButton";
import { categories } from "@/constants";
import cn from "clsx";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
const data = categories;

  return (
    <SafeAreaView className="bg-orange-100 h-full">
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          const isLeftColumn = index % 2 === 0;

          return (
            <View
              className={cn(
                "flex-1 max-w-[48%]",
                !isLeftColumn ? "mt-10" : "mt-0"
              )}
            >
              <MenuCart item={item} />
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-7 px-5 pb-32"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            {/* Header */}
            <View className="flex-between flex-row w-full">
              <View className="flex-start">
                <Text className="font-quicksand-bold text-xl uppercase text-primary">
                  Menu
                </Text>
                <Text className="font-quicksand-semibold text-dark-100 mt-2">
                  Find your favourite food
                </Text>
              </View>
              <CartButton />
            </View>

            <SearchBar />
            <Filter categories={categories} />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
