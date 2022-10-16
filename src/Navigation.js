import { StyleSheet, View, Dimensions } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { DATA } from "./consts";

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

const AnimatedView = ({ tappedIndex, item, i }) => {
  const screen = useSharedValue(1);
  const height = useSharedValue(0);

  const derived = useDerivedValue(() => {
    const isTru = tappedIndex.value === i;
    screen.value = isTru ? 1 : 0;
    return isTru
      ? (screen.value = withTiming(1, { duration: 820 }))
      : (screen.value = withTiming(0));
  });

  const animScreenStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(derived.value, [0, 1], [0.96, 1]),
        },
      ],
      borderRadius: interpolate(derived.value, [0, 1], [60, 40]),
      opacity: interpolate(derived.value, [0, 1], [0, 1]),
    };
  });

  const animTextStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: (height.value / 2) * -1,
        },
        {
          scale: interpolate(derived.value, [0, 1], [0, 1]),
        },
        {
          translateY: (height.value / 2) * 1,
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[styles.view, { backgroundColor: item.color }, animScreenStyle]}
    >
      <Animated.Text
        onLayout={({ nativeEvent: { layout } }) => {
          height.value = layout.height;
        }}
        style={[styles.text, animTextStyle]}
      >
        {item.name}
      </Animated.Text>
    </Animated.View>
  );
};

const Navigation = ({ tappedIndex }) => {
  return (
    <View style={styles.cont}>
      {DATA.map((item, i) => (
        <AnimatedView {...{ tappedIndex, item, i }} key={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  cont: {
    position: "absolute",
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  view: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  },
});

export default Navigation;
