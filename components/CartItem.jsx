import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CartItem = ({ item }) => {
  const { increaseQty, decreaseQty, removeItem } = useCartStore();

  const customizations = item.customizations ?? [];

  return (
    <View className="cart-item">
      <View className="flex flex-row items-center gap-x-3">
        <View className="cart-item__image">
          <Image
            source={ item.image }
            className="size-4/5 rounded-lg"
            resizeMode="cover"
          />
        </View>

        <View>
          <Text className="base-bold text-dark-100">{item.name}</Text>
          <Text className="paragraph-bold text-primary mt-1">
            Rs {item.price}
          </Text>

          <View className="flex flex-row items-center gap-x-4 mt-2">
            <TouchableOpacity
              onPress={() => decreaseQty(item.id, customizations)}
              className="cart-item__actions"
            >
              <Image
                source={images.minus}
                className="size-1/2"
                resizeMode="contain"
                tintColor="#FF9C01"
              />
            </TouchableOpacity>

            <Text className="base-bold text-dark-100">
              {item.quantity}
            </Text>

            <TouchableOpacity
              onPress={() => increaseQty(item.id, customizations)}
              className="cart-item__actions"
            >
              <Image
                source={images.plus}
                className="size-1/2"
                resizeMode="contain"
                tintColor="#FF9C01"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => removeItem(item.id, customizations)}
        className="flex-center"
      >
        <Image
          source={images.trash}
          className="size-7"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default CartItem;
