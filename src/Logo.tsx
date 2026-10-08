import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';

// SVG-пересборка логотипа UNI: непрерывная линия u→n + «i».
const U_N = 'M92 130 V210 A90 90 0 0 0 272 210 A80 80 0 0 1 432 210 V345';
const LEN = 1000;

export const Logo: React.FC<{color: string; width: number; draw?: boolean; delay?: number}> = ({
  color,
  width,
  draw = true,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const t = draw
    ? interpolate(frame - delay, [0, 28], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      })
    : 1;
  const iT = interpolate(frame - delay, [20, 36], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <svg width={width} height={(width * 485) / 621} viewBox="0 0 621 485">
      <path
        d={U_N}
        fill="none"
        stroke={color}
        strokeWidth={62}
        strokeDasharray={LEN * 1.2}
        strokeDashoffset={LEN * 1.2 * (1 - t)}
      />
      <rect x={489} y={137} width={64} height={208 * iT} rx={4} fill={color} transform={`translate(0 ${208 * (1 - iT)})`} style={{transformBox: 'fill-box'}} />
      <circle cx={521} cy={85} r={34 * iT} fill={color} />
    </svg>
  );
};
