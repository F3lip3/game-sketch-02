/* eslint-disable no-restricted-globals */
interface IGetSpeedProps {
  value: number;
  max: number;
  maxLevel: number;
}

interface IGetXYProps {
  dx: number;
  dy: number;
  max: number;
}

interface IGetXYResponse {
  dx: number;
  dy: number;
}

interface IGetAngleProps {
  y: number;
  h: number;
}

interface IGetHypotenuseProps {
  x: number;
  y: number;
}

interface IGetXProps {
  h: number;
  y: number;
}

interface IGetYProps {
  h: number;
  angle: number;
}

function getAngle({ y, h }: IGetAngleProps) {
  return Math.asin(y / h);
}

function getHypotenuse({ x, y }: IGetHypotenuseProps) {
  return Math.sqrt(x ** 2 + y ** 2);
}

function getX({ h, y }: IGetXProps) {
  return Math.sqrt(h ** 2 - y ** 2);
}

function getY({ h, angle }: IGetYProps) {
  return h * Math.sin(angle);
}

export function getSpeed({ value, max, maxLevel }: IGetSpeedProps): number {
  if (maxLevel <= 1) return 1;

  const speedBlock = max / maxLevel;

  let speed = 0;

  // eslint-disable-next-line no-plusplus
  for (let level = 1; level <= maxLevel; level++) {
    if (value <= speedBlock * level) {
      speed = level;
      break;
    }
  }

  return speed;
}

export function getXY({ dx, dy, max }: IGetXYProps): IGetXYResponse {
  const x = Math.abs(dx);
  const y = Math.abs(dy);
  const h = getHypotenuse({ x, y });
  if (h <= max) {
    return { dx, dy };
  }

  const angle = getAngle({ y, h });
  const newY = getY({ h: max, angle });
  const newX = getX({ h: max, y: newY });

  const xMod = dx > 0 ? 1 : -1;
  const yMod = dy > 0 ? 1 : -1;

  return {
    dx: newX * xMod,
    dy: newY * yMod
  };
}
