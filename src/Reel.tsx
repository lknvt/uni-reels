import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, DARK, LIGHT, headline, body} from './theme';
import {Logo} from './Logo';
import {Subtitles} from './Subtitles';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Строка заголовка: выезжает снизу из маски
const Line: React.FC<{children: string; delay: number; size: number; color: string}> = ({children, delay, size, color}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 20});
  return (
    <div style={{overflow: 'hidden', lineHeight: 0.98}}>
      <div
        style={{
          fontFamily: headline,
          fontWeight: 700,
          fontSize: size,
          color,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          transform: `translateY(${(1 - p) * 110}%)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Tag: React.FC<{color: string}> = ({color}) => (
  <div style={{position: 'absolute', top: 120, left: 80, fontFamily: headline, fontWeight: 700, fontSize: 44, letterSpacing: 6, color}}>
    UNI
  </div>
);

const Scene: React.FC<{bg: string; fg: string; children: React.ReactNode}> = ({bg, fg, children}) => {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, [0, 12], [100, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{background: bg, clipPath: `inset(${wipe}% 0 0 0)`}}>
      <Tag color={fg} />
      {children}
    </AbsoluteFill>
  );
};

// Рисующаяся линия
const Stroke: React.FC<{d: string; delay: number; len?: number; color: string; w?: number; dur?: number}> = ({d, delay, len = 2000, color, w = 8, dur = 30}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, dur], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - t)} />;
};

// 1. Хук
const Hook: React.FC = () => (
  <Scene bg={DARK} fg={LIGHT}>
    <div style={{position: 'absolute', top: 300, left: 80, right: 80}}>
      <Line delay={4} size={200} color={LIGHT}>Вашему</Line>
      <Line delay={9} size={200} color={LIGHT}>бизнесу</Line>
      <Line delay={14} size={200} color={ACCENT}>нужен</Line>
      <Line delay={19} size={200} color={ACCENT}>сайт?</Line>
    </div>
    <div style={{position: 'absolute', bottom: 480, left: 80}}>
      <Logo color={LIGHT} width={340} delay={30} />
    </div>
  </Scene>
);

// 2. Сайты под ключ — окно браузера
const Turnkey: React.FC = () => (
  <Scene bg={LIGHT} fg={DARK}>
    <div style={{position: 'absolute', top: 300, left: 80, right: 80}}>
      <Line delay={4} size={190} color={DARK}>Сайты</Line>
      <Line delay={9} size={190} color={DARK}>под ключ</Line>
    </div>
    <svg style={{position: 'absolute', left: 80, top: 880}} width={920} height={480} viewBox="0 0 920 480">
      <Stroke d="M20 20 H900 V460 H20 Z" delay={14} color={DARK} w={10} />
      <Stroke d="M20 90 H900" delay={24} color={DARK} w={10} />
      <circle cx={60} cy={55} r={11} fill={DARK} />
      <circle cx={100} cy={55} r={11} fill={DARK} />
      <circle cx={140} cy={55} r={11} fill={DARK} />
      <Stroke d="M60 150 H420 M60 200 H340 M60 250 H380" delay={34} color={DARK} w={14} dur={24} len={400} />
      <Stroke d="M500 140 H860 V420 H500 Z" delay={40} color={DARK} w={10} len={1300} />
      <Stroke d="M500 420 L620 300 L700 370 L760 320 L860 420" delay={52} color={ACCENT} w={10} len={600} />
    </svg>
  </Scene>
);

// 3. Что входит
const Item: React.FC<{label: string; delay: number}> = ({label, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 18, stiffness: 140}});
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 36, transform: `translateX(${(1 - p) * 700}px)`, opacity: Math.min(1, p * 2)}}>
      <svg width={90} height={90} viewBox="0 0 90 90">
        <circle cx={45} cy={45} r={40} fill="none" stroke={ACCENT} strokeWidth={8} />
        <Stroke d="M26 46 L40 60 L66 32" delay={delay + 8} color={ACCENT} w={9} len={90} dur={14} />
      </svg>
      <div style={{fontFamily: headline, fontWeight: 700, fontSize: 130, color: LIGHT, textTransform: 'uppercase', lineHeight: 1}}>{label}</div>
    </div>
  );
};

const Includes: React.FC = () => (
  <Scene bg={DARK} fg={LIGHT}>
    <div style={{position: 'absolute', top: 380, left: 80, right: 40, display: 'flex', flexDirection: 'column', gap: 90}}>
      <Item label="Дизайн" delay={6} />
      <Item label="Разработка" delay={36} />
      <Item label="SEO" delay={66} />
      <Item label="Под ключ" delay={92} />
    </div>
  </Scene>
);

// 4. Чат-боты
const Bubble: React.FC<{text: string; delay: number; right?: boolean; dark?: boolean}> = ({text, delay, right, dark}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 160}});
  return (
    <div
      style={{
        alignSelf: right ? 'flex-end' : 'flex-start',
        transform: `scale(${p})`,
        transformOrigin: right ? 'right bottom' : 'left bottom',
        background: dark ? DARK : 'transparent',
        color: dark ? LIGHT : DARK,
        border: `8px solid ${DARK}`,
        borderRadius: 48,
        padding: '26px 44px',
        fontFamily: body,
        fontWeight: 800,
        fontSize: 54,
      }}
    >
      {text}
    </div>
  );
};

const Bots: React.FC = () => (
  <Scene bg={LIGHT} fg={DARK}>
    <div style={{position: 'absolute', top: 300, left: 80, right: 80}}>
      <Line delay={4} size={150} color={DARK}>Чат-боты</Line>
      <Line delay={9} size={150} color={DARK}>для продаж</Line>
      <Line delay={14} size={150} color={ACCENT}>24/7</Line>
    </div>
    <div style={{position: 'absolute', top: 1000, left: 80, right: 80, display: 'flex', flexDirection: 'column', gap: 30}}>
      <Bubble text="Хочу сайт для бизнеса" delay={24} right />
      <Bubble text="Конечно! Оставьте заявку" delay={40} dark />
      <Bubble text="Заявка принята ✓" delay={54} dark />
    </div>
  </Scene>
);

// 5. Финал
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 40, fps, config: {damping: 200}});
  return (
    <Scene bg={DARK} fg={LIGHT}>
      <div style={{position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Logo color={LIGHT} width={640} delay={6} />
      </div>
      <div style={{position: 'absolute', top: 800, left: 80, right: 80, textAlign: 'center'}}>
        <Line delay={30} size={170} color={LIGHT}>Ваша идея.</Line>
        <Line delay={36} size={170} color={ACCENT}>Наш код.</Line>
      </div>
      <div style={{position: 'absolute', top: 1190, left: 0, right: 0, textAlign: 'center', fontFamily: body, color: LIGHT, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
        <div style={{fontSize: 56, fontWeight: 800}}>@uni___web</div>
        <div style={{fontSize: 44, fontWeight: 600, marginTop: 14, opacity: 0.75}}>wa.me/996556385552</div>
      </div>
    </Scene>
  );
};

export const Reel: React.FC = () => (
  <AbsoluteFill style={{background: DARK}}>
    <Sequence from={0} durationInFrames={90}><Hook /></Sequence>
    <Sequence from={90} durationInFrames={90}><Turnkey /></Sequence>
    <Sequence from={180} durationInFrames={115}><Includes /></Sequence>
    <Sequence from={295} durationInFrames={65}><Bots /></Sequence>
    <Sequence from={360} durationInFrames={90}><Outro /></Sequence>
    <Subtitles />
  </AbsoluteFill>
);
