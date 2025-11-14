import React, { useRef, useMemo, useState } from 'react';
import { NativeScrollEvent } from 'react-native';
import { NativeSyntheticEvent } from 'react-native';
import { Animated, Image, View, LayoutChangeEvent } from 'react-native';

interface CarouselProps {
  images: (string | any)[];
  itemSize?: number;
  spacing?: number;
  onIndexChange?: (index: number) => void;
}

const Carousel = ({
  images,
  itemSize = 230,
  spacing = 10,
  onIndexChange,
}: CarouselProps) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [layoutWidth, setLayoutWidth] = useState(0);

  const FULL_ITEM_WIDTH = useMemo(
    () => itemSize + spacing,
    [itemSize, spacing],
  );
  const CENTER_OFFSET = useMemo(
    () => (layoutWidth ? (layoutWidth - itemSize) / 2 : 0),
    [layoutWidth, itemSize],
  );

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width !== layoutWidth) setLayoutWidth(width);
  };

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / FULL_ITEM_WIDTH);
    if (onIndexChange) onIndexChange(index);
  };

  return (
    <View onLayout={handleLayout}>
      <Animated.FlatList
        data={images}
        horizontal
        keyExtractor={(_, i) => i.toString()}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={FULL_ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={{
          paddingHorizontal: CENTER_OFFSET,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * FULL_ITEM_WIDTH,
            index * FULL_ITEM_WIDTH,
            (index + 1) * FULL_ITEM_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={{
                width: itemSize,
                height: itemSize,
                marginRight: index === images.length - 1 ? 0 : spacing,
                transform: [{ scale }],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={
                  typeof item === 'string'
                    ? { uri: item }
                    : item?.uri
                    ? { uri: item.uri }
                    : item
                }
                style={{
                  width: itemSize,
                  height: itemSize,
                  borderRadius: 12,
                  resizeMode: 'cover',
                }}
                onError={e => {
                  console.log('❌ Image load error:', item, e.nativeEvent);
                }}
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

export default Carousel;
