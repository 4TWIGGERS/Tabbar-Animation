import React from "react";
import { Dimensions, StyleSheet, View, Pressable } from "react-native";
import Animated, {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
  useAnimatedProps,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(Pressable);
const { width, height } = Dimensions.get("window");

const ON_TWO = 2;
const ICON_COUNT = 3;
const arr = new Array(ICON_COUNT).fill("");
const ICON_WIDTH = 40;
const HILL_WIDTH = 70;
const ICON_HEIGHT = 30;
const BALL_WIDTH_HEIGHT = 12;
const ICON_CONTAINER_HEIGHT = 130;
const MARGIN_LEFT = (width - ICON_WIDTH * ICON_COUNT) / 4;
const HILL_MARGIN_TOP = height / ON_TWO + ICON_CONTAINER_HEIGHT / ON_TWO;
const ICON_CONTAINER_PADDING_TOP =
  ICON_CONTAINER_HEIGHT / ON_TWO - ICON_HEIGHT / ON_TWO;
const BALL_MARGIN_LEFT =
  MARGIN_LEFT + (ICON_WIDTH / ON_TWO - BALL_WIDTH_HEIGHT / ON_TWO);

const IconsComp = ({ tappedIndex, hill, ballY, vertex, i }) => {
  const iconY = useSharedValue(0);
  const fill = useSharedValue(0);
  const height = useSharedValue(0);

  const iconYStyle = useAnimatedStyle(() => {
    return {
      top: interpolate(iconY.value, [0, 1], [1, 10]),
    };
  });

  const filled = useDerivedValue(() => {
    const isTrue = i === tappedIndex.value;
    fill.value = isTrue ? 1 : 0;
    return withDelay(300, withTiming(fill.value));
  });

  const iconFillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: (height.value / 2) * 1,
        },
        {
          scale: interpolate(filled.value, [0, 1], [0, 1]),
        },
        {
          translateY: (height.value / 2) * -1,
        },
      ],
      borderRadius: interpolate(
        filled.value,
        [0, 0.5, 0.9, 1],
        [10, 30, 30, 0]
      ),
    };
  });

  const _onPress = () => {
    tappedIndex.value = i;
    hill.value = i;

    iconY.value = withTiming(1, {}, () => {
      iconY.value = withSpring(0);
    });

    vertex.value = withTiming(-16, {}, () => {
      ballY.value = withTiming(1, {}, () => {
        ballY.value = 0;
      });
      vertex.value = withTiming(-40, {}, () => {
        vertex.value = withTiming(-30);
      });
    });
  };

  return (
    <AnimatedTouchableOpacity
      onPress={_onPress}
      key={i}
      style={[styles.button, iconYStyle]}
    >
      <Animated.View
        onLayout={({ nativeEvent: { layout } }) => {
          height.value = layout.height;
        }}
        style={[styles.fill, iconFillStyle]}
      />
    </AnimatedTouchableOpacity>
  );
};

const TabBarAnimation = () => {
  const hill = useSharedValue(0);
  const hillX = useSharedValue(0);
  const ballY = useSharedValue(0);
  const vertex = useSharedValue(-30);
  const tappedIndex = useSharedValue(-1);

  const path = useDerivedValue(() => {
    hillX.value = withTiming(hill.value * (MARGIN_LEFT + ICON_WIDTH));

    return `M ${hillX.value} ${HILL_MARGIN_TOP} c 35 ${vertex.value} 35 ${vertex.value} ${HILL_WIDTH} 0`;
  });

  const pathProps = useAnimatedProps(() => {
    return {
      d: path.value,
    };
  });

  const ballStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(hill.value * (MARGIN_LEFT + ICON_WIDTH)),
        },
        {
          translateY: interpolate(ballY.value, [0, 1], [0, -52]),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {arr.map((_, i) => (
          <IconsComp {...{ tappedIndex, hill, ballY, vertex, i }} key={i} />
        ))}
        <Animated.View style={[styles.ball, ballStyle]} />
      </View>

      <Svg style={styles.svgStyle}>
        <AnimatedPath animatedProps={pathProps} fill='black' />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "orange",
  },
  iconContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    position: "absolute",
    width: "100%",
    height: 130,
    borderRadius: 20,
    paddingTop: ICON_CONTAINER_PADDING_TOP,
  },
  button: {
    backgroundColor: "lightgrey",
    width: ICON_WIDTH,
    height: ICON_HEIGHT,
    marginLeft: MARGIN_LEFT,
  },
  fill: {
    backgroundColor: "black",
    width: ICON_WIDTH,
    height: 30,
  },
  ball: {
    backgroundColor: "black",
    width: BALL_WIDTH_HEIGHT,
    height: BALL_WIDTH_HEIGHT,
    position: "absolute",
    borderRadius: 21,
    bottom: 0,
    marginLeft: BALL_MARGIN_LEFT,
  },
  svgStyle: {
    height,
    width,
    marginLeft: MARGIN_LEFT - 14,
  },
});

export default TabBarAnimation;
