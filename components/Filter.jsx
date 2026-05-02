import cn from 'clsx';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMenuByCategoryAsync,
  selectSelectedCategory,
  setCategory,
} from '@/services/customerSlice';

const Filter = ({ categories = [], restaurantId }) => {
  const dispatch = useDispatch();
  const active = useSelector(selectSelectedCategory);

  const handlePress = (categoryName) => {
    dispatch(setCategory(categoryName));
    dispatch(fetchMenuByCategoryAsync({ restaurantId, category: categoryName }));
  };

  if (!categories.length) return null;

  return (
    <View className="pb-3">
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            className={cn(
              'px-4 py-2 rounded-full',
              active === item
                ? 'bg-orange-600'
                : 'bg-orange-50 border-2 border-orange-200'
            )}
          >
            <Text
              className={cn(
                'text-sm',
                active === item ? 'text-white' : 'text-neutral-700'
              )}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Filter;