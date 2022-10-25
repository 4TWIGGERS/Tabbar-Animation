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
import Svg, { Path, Defs, Rect, Mask } from "react-native-svg";
import { D } from "./consts";

import Navigation from "./Navigation";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedButton = Animated.createAnimatedComponent(Pressable);
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");
const initialColor = "#7b5804";
const ICON_COUNT = 3;
const arr = new Array(ICON_COUNT).fill("");
const ICON_WIDTH = 30;
const ICON_HEIGHT = 30;
const FILL_HEIGHT = 30;
const HILL_WIDTH = 56;
const BALL_WIDTH_HEIGHT = 8;
const ICON_CONT_MARGIN_LEFT = 18;
const ICON_CONTAINER_HEIGHT = 95;
const ICON_CONTAINER_BOTTOM = 20;
const ICON_CONTAINER_WIDTH = WINDOW_WIDTH - ICON_CONT_MARGIN_LEFT * 2;
const HILL_MARGIN_TOP = WINDOW_HEIGHT - ICON_CONTAINER_BOTTOM;
const ICON_MARGIN_LEFT =
  (ICON_CONTAINER_WIDTH - ICON_WIDTH * ICON_COUNT) / (arr.length + 1);
const ICON_CONTAINER_PADDING_TOP =
  ICON_CONTAINER_HEIGHT / 2.2 - ICON_HEIGHT / 2;
const HILL_MARGIN_LEFT =
  ICON_MARGIN_LEFT + ICON_CONT_MARGIN_LEFT - (HILL_WIDTH - ICON_WIDTH) / 2;
const BALL_MARGIN_LEFT =
  ICON_MARGIN_LEFT + (ICON_WIDTH - BALL_WIDTH_HEIGHT) / 2;

const IconsComp = ({ tappedIndex, ballY, vertex, i, iconContValue }) => {
  const iconY = useSharedValue(0);
  const fill = useSharedValue(0);
  const height = useSharedValue(0);

  const iconYStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(iconY.value, [0, 1], [0, 10]),
        },
      ],
    };
  });

  const filled = useDerivedValue(() => {
    const isTrue = i === tappedIndex.value;
    fill.value = isTrue ? 1 : 0;
    return isTrue
      ? withDelay(
          500,
          withTiming(fill.value, {
            duration: 200,
          })
        )
      : withTiming(fill.value);
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
      borderRadius: interpolate(filled.value, [0, 1], [50, 0]),
    };
  });

  const _onPress = () => {
    tappedIndex.value = i;

    iconContValue.value = withTiming(!iconContValue.value, {}, () => {
      iconContValue.value = withTiming(0);
    });

    iconY.value = withTiming(1, {}, () => {
      iconY.value = withSpring(0);
    });

    vertex.value = withTiming(-12, {}, () => {
      ballY.value = withTiming(1, { duration: 376 }, () => {
        ballY.value = 0;
      });
      vertex.value = withTiming(-30, {}, () => {
        vertex.value = withTiming(-20);
      });
    });
  };

  return (
    <View>
      <AnimatedButton
        // onPress={_onPress}
        key={i}
        style={[styles.button, iconYStyle]}
      >
        <Animated.View
          onLayout={({ nativeEvent: { layout } }) => {
            height.value = layout.height;
          }}
          style={[styles.fill, iconFillStyle]}
        />
      </AnimatedButton>
      <AnimatedSvg
        onPress={_onPress}
        height={30}
        width={30}
        style={[styles.animatedSvg, iconYStyle]}
      >
        <Defs>
          <Mask id='mask' x='0' y='0' height={30} width={30}>
            <Rect x={0} y={0} rx={0} height={30} width={30} fill='#fff' />
            <Path x={0} y={0} d={D[i]} fill='#000' />
          </Mask>
        </Defs>
        <Rect
          mask='url(#mask)'
          x={0}
          y={0}
          rx={0}
          height={30}
          width={30}
          fill='gold'
          fill-opacity='0'
        />
      </AnimatedSvg>
    </View>
  );
};

const TabBarAnimation = () => {
  const hillX = useSharedValue(0);
  const ballY = useSharedValue(0);
  const vertex = useSharedValue(-20);
  const tappedIndex = useSharedValue(0);
  const iconContValue = useSharedValue(0);

  const path = useDerivedValue(() => {
    hillX.value = withTiming(
      tappedIndex.value * (ICON_MARGIN_LEFT + ICON_WIDTH)
    );

    return `M ${hillX.value} ${HILL_MARGIN_TOP} c 28 ${vertex.value} 28 ${vertex.value} ${HILL_WIDTH} 0`;
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
          translateX: withTiming(
            tappedIndex.value * (ICON_MARGIN_LEFT + ICON_WIDTH)
          ),
        },
        {
          translateY: interpolate(ballY.value, [0, 1], [0, -42]),
        },
      ],
    };
  });
  const iconContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(iconContValue.value, [0, 1], [1, 0.98]),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Navigation {...{ tappedIndex }} />
      <Animated.View style={[styles.iconContainer, iconContainerStyle]}>
        {arr.map((_, i) => (
          <IconsComp
            {...{ tappedIndex, ballY, vertex, i, iconContValue }}
            key={i}
          />
        ))}
        <Animated.View style={[styles.ball, ballStyle]} />
      </Animated.View>
      <Svg style={styles.svgStyle}>
        <AnimatedPath animatedProps={pathProps} fill={initialColor} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "gold",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    width: ICON_CONTAINER_WIDTH,
    height: ICON_CONTAINER_HEIGHT,
    bottom: ICON_CONTAINER_BOTTOM,
    marginLeft: ICON_CONT_MARGIN_LEFT,
    paddingTop: ICON_CONTAINER_PADDING_TOP,
  },
  button: {
    overflow: "hidden",
    backgroundColor: "white",
    width: ICON_WIDTH,
    height: ICON_HEIGHT,
    marginLeft: ICON_MARGIN_LEFT,
  },
  fill: {
    backgroundColor: initialColor,
    width: ICON_WIDTH,
    height: FILL_HEIGHT,
  },
  ball: {
    bottom: 0,
    borderRadius: 21,
    position: "absolute",
    backgroundColor: initialColor,
    width: BALL_WIDTH_HEIGHT,
    height: BALL_WIDTH_HEIGHT,
    marginLeft: BALL_MARGIN_LEFT,
  },
  svgStyle: {
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    marginLeft: HILL_MARGIN_LEFT,
  },
  animatedSvg: {
    position: "absolute",
    marginLeft: ICON_MARGIN_LEFT,
  },
});

export default TabBarAnimation;
