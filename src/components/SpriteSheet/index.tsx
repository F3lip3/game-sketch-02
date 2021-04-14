/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import { Animated, Easing, Image as NativeImage, View } from 'react-native';

interface IAnimations {
  [name: string]: number[];
}

interface ICoords {
  x: number;
  y: number;
}

interface IInterpolationRange {
  translateY: {
    in: number[];
    out: number[] | string[];
  };
  translateX: {
    in: number[];
    out: number[] | string[];
  };
}

interface IInterpolationRanges {
  [key: string]: IInterpolationRange;
}

export interface ISpriteSheetFunctions {
  play: (data: ISpriteSheetPlayProps) => void;
  reset: (data: ISpriteSheetStopProps) => void;
  stop: (data: ISpriteSheetStopProps) => void;
}

interface ISpriteSheetPlayProps {
  type: string;
  fps?: number;
  loop?: boolean;
  resetAfterFinish?: boolean;
  onFinish?: () => void;
}

interface ISpriteSheetProps {
  source: any;
  columns: number;
  rows: number;
  animations: IAnimations;
  height?: number;
  width?: number;
  frameHeight?: number;
  frameWidth?: number;
  offsetX?: number;
  offsetY?: number;
}

interface ISpriteSheetStopProps {
  cb: (value: number) => void;
}

const SpriteSheet: React.ForwardRefRenderFunction<
  ISpriteSheetFunctions,
  ISpriteSheetProps
> = (
  {
    source,
    columns,
    rows,
    animations,
    height,
    width,
    frameHeight: initialFrameHeight,
    frameWidth: initialFrameWidth,
    offsetX: initialOffsetX,
    offsetY: initialOffsetY
  },
  ref
) => {
  const [animationType, setAnimationType] = useState('');
  const [frameHeight, setFrameHeight] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const [
    interpolationRanges,
    setInterpolationRanges
  ] = useState<IInterpolationRanges>({} as IInterpolationRanges);

  const time = useMemo(() => {
    return new Animated.Value(0);
  }, []);

  const image = useMemo(() => {
    return NativeImage.resolveAssetSource(source);
  }, [source]);

  const interpolation = useMemo(() => {
    return (interpolationRanges[animationType] || {
      translateX: {
        in: [0, 0],
        out: [offsetX, offsetX]
      },
      translateY: {
        in: [0, 0],
        out: [offsetY, offsetY]
      }
    }) as IInterpolationRange;
  }, [animationType, interpolationRanges, offsetX, offsetY]);

  const getFrameCoords = useCallback(
    (i: number) => {
      const currentColumn = i % columns;
      const xAdjust = -currentColumn * frameWidth - offsetX;
      const yAdjust = -((i - currentColumn) / columns) * frameHeight - offsetY;

      return {
        x: xAdjust,
        y: yAdjust
      } as ICoords;
    },
    [columns, frameHeight, frameWidth, offsetX, offsetY]
  );

  const generateInterpolationRanges = useCallback(() => {
    const ranges = Object.keys(animations).reduce<IInterpolationRanges>(
      (result, key) => {
        const { length } = animations[key];
        const input = [].concat(
          ...Array.from({ length }, (_, i) => [i, i + 1])
        );

        return {
          ...result,
          [key]: {
            translateX: {
              in: input,
              out: [].concat(
                ...animations[key].map(i => {
                  const { x } = getFrameCoords(i);
                  return [x, x];
                })
              )
            },
            translateY: {
              in: input,
              out: [].concat(
                ...animations[key].map(i => {
                  const { x } = getFrameCoords(i);
                  return [x, x];
                })
              )
            }
          }
        };
      },
      {} as IInterpolationRanges
    );

    console.info(JSON.stringify(ranges, null, 2));
    setInterpolationRanges(ranges);
  }, [animations, getFrameCoords]);

  const play = useCallback(
    ({
      type,
      fps = 24,
      loop = false,
      resetAfterFinish = false,
      onFinish = () => {}
    }: ISpriteSheetPlayProps) => {
      setAnimationType(type);

      const { length } = animations[type];
      const animation = Animated.timing(time, {
        toValue: length,
        duration: (length / fps) * 1000,
        easing: Easing.linear,
        useNativeDriver: true
      });

      time.setValue(0);

      if (loop) {
        Animated.loop(animation).start();
      } else {
        animation.start(() => {
          if (resetAfterFinish) {
            time.setValue(0);
          }
          onFinish();
        });
      }
    },
    [animations, time]
  );

  const reset = useCallback(
    ({ cb }: ISpriteSheetStopProps) => {
      time.stopAnimation(cb);
      time.setValue(0);
    },
    [time]
  );

  const stop = useCallback(
    ({ cb }: ISpriteSheetStopProps) => {
      time.stopAnimation(cb);
    },
    [time]
  );

  useEffect(() => {
    let ratio = 1;

    setOffsetX(initialOffsetX ? -initialOffsetX : 0);
    setOffsetY(initialOffsetY ? -initialOffsetY : 0);

    if (width) {
      ratio = (width * columns) / image.width;
      setImageHeight(image.height * ratio);
      setImageWidth(width * columns);
      setFrameHeight((image.height / rows) * ratio);
      setFrameWidth(width);
    } else if (height) {
      ratio = (height * rows) / image.height;
      setImageHeight(height * rows);
      setImageWidth(image.width * ratio);
      setFrameHeight(height);
      setFrameWidth((image.width / columns) * ratio);
    } else {
      setImageHeight(image.height);
      setImageWidth(image.width);
      setFrameHeight(initialFrameHeight || image.height / rows);
      setFrameWidth(initialFrameWidth || image.width / columns);
    }

    generateInterpolationRanges();
  }, [
    columns,
    generateInterpolationRanges,
    height,
    image,
    initialFrameHeight,
    initialFrameWidth,
    initialOffsetX,
    initialOffsetY,
    rows,
    width
  ]);

  useImperativeHandle(ref, () => {
    return {
      play,
      reset,
      stop
    };
  });

  return (
    <View
      style={[
        {
          height: frameHeight,
          width: frameWidth,
          overflow: 'hidden'
        }
      ]}
    >
      <Animated.Image
        source={source}
        style={[
          {
            height: imageHeight,
            width: imageWidth,
            transform: [
              {
                translateX: time.interpolate({
                  inputRange: interpolation.translateX.in,
                  outputRange: interpolation.translateX.out
                })
              },
              {
                translateY: time.interpolate({
                  inputRange: interpolation.translateY.in,
                  outputRange: interpolation.translateY.out
                })
              }
            ]
          }
        ]}
      />
    </View>
  );
};

export default forwardRef(SpriteSheet);
