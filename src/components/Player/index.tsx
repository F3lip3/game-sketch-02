import React, { useRef } from 'react';

import SpriteSheet, { ISpriteSheetFunctions } from '../SpriteSheet';

interface IPlayerProps {
  x?: number;
  y?: number;
}

const Player: React.FC<IPlayerProps> = ({ x = 0, y = 0 }) => {
  const spriteSheetRef = useRef<ISpriteSheetFunctions>(null);

  return (
    <SpriteSheet
      ref={spriteSheetRef}
      source={require('../../assets/warrior_01.png')}
      columns={30}
      rows={4}
      coords={{ x, y }}
      animations={{
        move_right: Array.from({ length: 30 }, (v, i) => i),
        move_down: Array.from({ length: 30 }, (v, i) => i + 30),
        move_left: Array.from({ length: 30 }, (v, i) => i + 60),
        move_up: Array.from({ length: 30 }, (v, i) => i + 90)
      }}
    />
  );
};

export default Player;
