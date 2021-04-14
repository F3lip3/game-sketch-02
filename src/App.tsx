import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import SpriteSheet, { ISpriteSheetFunctions } from './components/SpriteSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const App: React.FC = () => {
  const spriteSheetRef = useRef<ISpriteSheetFunctions>(null);

  useEffect(() => {
    spriteSheetRef.current.play({
      type: 'move_down',
      loop: true
    });
  }, []);

  return (
    <View style={styles.container}>
      <SpriteSheet
        ref={spriteSheetRef}
        source={require('./assets/warrior_01.png')}
        columns={30}
        rows={4}
        animations={{
          move_right: Array.from({ length: 30 }, (v, i) => i * 1),
          move_down: Array.from({ length: 30 }, (v, i) => i * 1),
          move_left: Array.from({ length: 30 }, (v, i) => i * 1),
          move_up: Array.from({ length: 30 }, (v, i) => i * 1)
        }}
      />
    </View>
  );
};

export default App;
