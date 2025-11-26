import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import { colors } from '../../../styles/colors';
import BottomList from './BottomList';
import { BottomListItem } from '../../../types/BottomListItem';

const { height } = Dimensions.get('window');
const SHEET_TOP_PADDING = 130;
const EXPANDED = SHEET_TOP_PADDING;
const MID_POSITION = height * 0.4;
const INITIAL_POSITION = height * 0.63;
const DIMISSED_POSITION = height * 0.8;

type BottomSheetProps = {
  activeTab: 'popular' | 'favorite' | 'route' | 'place';
  listData: BottomListItem[];
  setListData: React.Dispatch<React.SetStateAction<BottomListItem[]>>;
};

export type BottomSheetRef = {
  collapse: () => void;
  reset: () => void;
};

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (props, ref) => {
    const { activeTab, listData, setListData } = props;
    const translateY = useSharedValue(INITIAL_POSITION);
    const context = useSharedValue({ y: 0 });

    const springConfig = {
      damping: 30,
      stiffness: 100,
      mass: 0.8,
      overshootClamping: true,
    };

    useImperativeHandle(ref, () => ({
      collapse: () => {
        translateY.value = withSpring(DIMISSED_POSITION, springConfig);
      },
      reset: () => {
        translateY.value = withSpring(INITIAL_POSITION, springConfig);
      },
    }));

    useEffect(() => {
      setTimeout(() => {
        translateY.value = withSpring(INITIAL_POSITION, springConfig);
      }, 50);
    }, [activeTab]);

    const panGesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate(event => {
        translateY.value = Math.min(
          INITIAL_POSITION,
          Math.max(EXPANDED, context.value.y + event.translationY),
        );
      })
      .onEnd(() => {
        const threshold1 = (EXPANDED + MID_POSITION) / 2;
        const threshold2 = (MID_POSITION + INITIAL_POSITION) / 2;

        if (translateY.value < threshold1) {
          translateY.value = withSpring(EXPANDED, springConfig);
        } else if (translateY.value < threshold2) {
          translateY.value = withSpring(MID_POSITION, springConfig);
        } else {
          translateY.value = withSpring(INITIAL_POSITION, springConfig);
        }
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    return (
      <GestureDetector gesture={panGesture}>
        <AnimatedSheet style={animatedStyle}>
          <HandleBar />
          <BottomList
            type={activeTab}
            listData={listData}
            setListData={setListData}
          />
        </AnimatedSheet>
      </GestureDetector>
    );
  },
);

export default BottomSheet;

const AnimatedSheet = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${height + 200}px;
  background-color: ${colors.white};
  filter: drop-shadow(0 -4px 4px rgba(0, 0, 0, 0.13));
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  z-index: 10;
  padding: 0 24px 80px;
  elevation: 8;
  shadow-color: #000;
  shadow-offset: 0px -6px;
  shadow-opacity: 0.08;
  shadow-radius: 13.4px;
`;

const HandleBar = styled.View`
  width: 86px;
  height: 4px;
  border-radius: 12px;
  background-color: ${colors.gray2};
  align-self: center;
  margin-bottom: 24px;
  margin-top: 12.76px;
`;
