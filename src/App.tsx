import React, { useCallback, useRef } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import GamePad, { IGamePadOutput } from './components/GamePad';
import SpriteSheet, { ISpriteSheetFunctions } from './components/SpriteSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#777046',
    alignItems: 'center',
    justifyContent: 'center'
  },
  game: {
    flex: 1,
    backgroundColor: '#303030',
    width: '100%'
  },
  gamepad: {
    position: 'absolute',
    bottom: 30,
    left: 30
  }
});

const App: React.FC = () => {
  const directionRef = useRef('');
  const spriteSheetRef = useRef<ISpriteSheetFunctions>(null);

  const handleMovement = useCallback(({ direction, speed }: IGamePadOutput) => {
    if (speed === 0) {
      spriteSheetRef.current.stop();
    } else if (direction !== directionRef.current) {
      spriteSheetRef.current.play({
        type: `move_${direction}`,
        loop: true
      });
    }

    // if (engine) {
    //   engine.dispatch({ type: `move_${direction}`, speed });
    // }
  }, []);

  return (
    <>
      <SafeAreaView />
      <View style={styles.container}>
        <SpriteSheet
          ref={spriteSheetRef}
          source={require('./assets/warrior_01.png')}
          columns={30}
          rows={4}
          animations={{
            move_right: Array.from({ length: 30 }, (v, i) => i),
            move_down: Array.from({ length: 30 }, (v, i) => i + 30),
            move_left: Array.from({ length: 30 }, (v, i) => i + 60),
            move_up: Array.from({ length: 30 }, (v, i) => i + 90)
          }}
        />
        <GamePad
          maxSpeedLevel={1}
          onChange={handleMovement}
          size={120}
          style={styles.gamepad}
        />
      </View>
    </>
  );
};

export default App;
