import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, PanResponder, ViewProps } from 'react-native';
import { getSpeed, getXY } from './math';

import { Plate, Handler } from './styles';

export interface IGamePadOutput {
  direction: 'up' | 'right' | 'down' | 'left';
  speed: number;
}

interface IGamePadProps extends ViewProps {
  size: number;
  maxSpeedLevel: number;
  onChange: (output: IGamePadOutput) => void;
}

const GamePad: React.FC<IGamePadProps> = ({
  size = 120,
  maxSpeedLevel = 2,
  style,
  onChange
}) => {
  const [pan] = useState(new Animated.ValueXY());
  const [output, setOutput] = useState<IGamePadOutput>({
    direction: 'down',
    speed: 0
  });

  const handlePanChange = useCallback(
    ({ x, y }) => {
      if (x !== 0 && y !== 0) {
        if (Math.abs(x) > Math.abs(y)) {
          setOutput({
            direction: x > 0 ? 'right' : 'left',
            speed: getSpeed({
              value: Math.abs(x),
              max: size / 2,
              maxLevel: maxSpeedLevel
            })
          });
        } else {
          setOutput({
            direction: y > 0 ? 'down' : 'up',
            speed: getSpeed({
              value: Math.abs(y),
              max: size / 2,
              maxLevel: maxSpeedLevel
            })
          });
        }
      } else {
        setOutput(current => ({ ...current, speed: 0 }));
      }
    },
    [maxSpeedLevel, size]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        // onPanResponderGrant: () => {
        //   pan.setOffset({
        //     x: pan.x._value,
        //     y: pan.y._value
        //   });
        // },
        onPanResponderMove: (evt, gestureState) => {
          const max = size / 2;
          const { dx, dy } = gestureState;
          const newPosition = getXY({ dx, dy, max });

          Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false
          })(evt, newPosition);
        },
        onPanResponderRelease: () => {
          pan.setValue({ x: 0, y: 0 });
        }
      }),
    [pan, size]
  );

  useEffect(() => {
    pan.addListener(handlePanChange);
  }, [handlePanChange, pan]);

  useEffect(() => {
    onChange(output);
  }, [onChange, output]);

  return (
    <Plate size={size} style={style}>
      <Animated.View
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }]
        }}
        {...panResponder.panHandlers}
      >
        <Handler size={size} {...panResponder.panHandlers} />
      </Animated.View>
    </Plate>
  );
};

export default GamePad;
