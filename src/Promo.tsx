import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, DARK, LIGHT, body, headline} from './theme';
import {Logo} from './Logo';
import {Phrase, Subtitles} from './Subtitles';

export const PROMO_DURATION = 20 * 30; // 600 кадров

// Положите озвучку в public/voiceover.mp3 и поставьте true.
const HAS_VOICE = false;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Тайминги реплик (кадры @30fps) — подгоняются под реальную озвучку.
const PHRASES: Phrase[] = [
  {text: 'Ваш сайт теряет клиентов.', from: 0, to: 55},
  {text: 'Каждый день.', from: 55, to: 90},
  {text: 'Мы делаем сайты под ключ.', from: 90, to: 150},
  {text: 'Дизайн, который запоминается.', from: 150, to: 215},
  {text: 'Структура, которая продаёт.', from: 215, to: 285},
  {text: 'Подпишитесь на нас', from: 285, to: 345},
  {text: 'и напишите «+» в комментариях', from: 345, to: 420},
  {text: 'Бесплатно нарисуем дизайн-макет вашего сайта!', from: 420, to: 510},
  {text: 'UNI. Ваша идея. Наш код.', from: 510, to: 600},
];

const Slam: React.FC<{children: string; from: number; color?: string; size?: number}> = ({children, from, color = LIGHT, size = 185}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - from, fps, config: {damping: 12, stiffness: 260}, durationInFrames: 12});
  if (frame < from) return null;
  return (
    <div style={{fontFamily: headline, fontWeight: 700, fontSize: size, lineHeight: 0.95, color, textTransform: 'uppercase', whiteSpace: 'nowrap', transform: `scale(${1.5 - 0.5 * p})`, opacity: Math.min(1, p * 3), transformOrigin: 'left center'}}>
      {children}
    </div>
  );
};

// Хук: клиенты «уходят» с сайта
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [55, 58, 66], [0, 0.35, 0], clamp);
  return (
    <AbsoluteFill style={{background: DARK}}>
      <div style={{position: 'absolute', top: 300, left: 80}}>
        <Slam from={0}>Ваш сайт</Slam>
        <Slam from={12} color={ACCENT}>теряет</Slam>
        <Slam from={24} color={ACCENT}>клиентов</Slam>
      </div>
      <div style={{position: 'absolute', top: 960, left: 80, right: 80, display: 'flex', flexWrap: 'wrap', gap: 28}}>
        {Array.from({length: 12}).map((_, i) => {
          const leave = interpolate(frame, [40 + i * 3, 64 + i * 3], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
          return (
            <svg key={i} width={110} height={130} viewBox="0 0 110 130" style={{opacity: 1 - leave, transform: `translate(${leave * (i % 2 ? 140 : -140)}px, ${-leave * 90}px)`}}>
              <circle cx={55} cy={34} r={24} fill={LIGHT} />
              <path d="M10 125 C10 80 100 80 100 125 Z" fill={LIGHT} />
            </svg>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1270, left: 80, whiteSpace: 'nowrap', fontFamily: headline, fontWeight: 700, fontSize: 135, color: LIGHT, textTransform: 'uppercase', opacity: interpolate(frame, [58, 64], [0, 1], clamp)}}>
        каждый день.
      </div>
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

type Site = {img: string; name: string; tag: string; bg: string; fg: string; scroll: number; imgH: number};
const SITES: Site[] = [
  {img: 'shots/archa.jpg', name: 'АРЧА', tag: 'Стрижка растений', bg: '#050806', fg: LIGHT, scroll: 1100, imgH: 2600},
  {img: 'shots/toefl.jpg', name: 'TOEFL Center', tag: 'Языковой центр', bg: '#eef1f7', fg: '#0b1638', scroll: 1100, imgH: 2600},
  {img: 'shots/tirazh.jpg', name: 'TIRAZH', tag: 'Полиграфия и мерч', bg: '#EDEBE6', fg: '#0b1638', scroll: 1100, imgH: 2600},
];

const PHONE_W = 600;
const PHONE_H = 1190;

const Showcase: React.FC<{site: Site; idx: number; dur: number}> = ({site, idx, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame, fps, config: {damping: 18, stiffness: 120}});
  const outP = interpolate(frame, [dur - 10, dur], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const scroll = interpolate(frame, [8, dur - 8], [0, site.scroll], {...clamp, easing: Easing.inOut(Easing.quad)});
  return (
    <AbsoluteFill style={{background: site.bg, transform: `translateX(${-outP * 100}%)`}}>
      <div style={{position: 'absolute', top: 130, left: 80, fontFamily: headline, fontWeight: 700, fontSize: 44, letterSpacing: 6, color: site.fg}}>
        0{idx + 1} / 03
      </div>
      <div style={{position: 'absolute', top: 120, right: 80, textAlign: 'right', color: site.fg}}>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 56, textTransform: 'uppercase'}}>{site.name}</div>
        <div style={{fontFamily: body, fontWeight: 600, fontSize: 28, opacity: 0.7}}>{site.tag}</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: (1080 - PHONE_W) / 2,
          top: 250,
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 78,
          background: '#0b0c10',
          border: '10px solid #1b1d24',
          boxShadow: '0 50px 90px rgba(0,0,0,0.45)',
          overflow: 'hidden',
          transform: `translateY(${(1 - inP) * 900}px) rotate(${(1 - inP) * 6}deg)`,
        }}
      >
        <Img src={staticFile(site.img)} style={{width: PHONE_W - 20, position: 'absolute', left: 0, top: -scroll}} />
      </div>
    </AbsoluteFill>
  );
};

const Offer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pulse = 1 + Math.sin(frame / 5) * 0.025;
  const card = (n: string, text: string, delay: number) => {
    const p = spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 140}});
    return (
      <div key={n} style={{display: 'flex', alignItems: 'center', gap: 36, transform: `translateX(${(1 - p) * 900}px)`, background: '#1d2027', border: '2px solid rgba(237,235,230,0.2)', borderRadius: 36, padding: '34px 40px'}}>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 110, color: ACCENT, lineHeight: 1}}>{n}</div>
        <div style={{fontFamily: body, fontWeight: 800, fontSize: 52, color: LIGHT, lineHeight: 1.15}}>{text}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: DARK}}>
      <div style={{position: 'absolute', top: 240, left: 80, right: 80}}>
        <div style={{transform: `scale(${pulse})`, transformOrigin: 'left center', fontFamily: headline, fontWeight: 700, fontSize: 175, whiteSpace: 'nowrap', color: ACCENT, textTransform: 'uppercase', lineHeight: 0.95}}>бесплатно</div>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 108, whiteSpace: 'nowrap', color: LIGHT, textTransform: 'uppercase', lineHeight: 1, marginTop: 20}}>дизайн-макет<br />вашего сайта</div>
      </div>
      <div style={{position: 'absolute', top: 880, left: 80, right: 80, display: 'flex', flexDirection: 'column', gap: 28}}>
        {card('1', 'Подпишись на @uni___web', 6)}
        {card('2', 'Напиши «+» в комментариях', 20)}
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 30, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: DARK}}>
      <div style={{position: 'absolute', top: 420, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Logo color={LIGHT} width={640} delay={4} />
      </div>
      <div style={{position: 'absolute', top: 900, left: 0, right: 0, textAlign: 'center', color: LIGHT, fontFamily: body, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 120, whiteSpace: 'nowrap', textTransform: 'uppercase'}}>Сайты под ключ</div>
        <div style={{fontSize: 56, fontWeight: 800, marginTop: 20, color: ACCENT}}>@uni___web</div>
      </div>
    </AbsoluteFill>
  );
};

export const Promo: React.FC = () => (
  <AbsoluteFill style={{background: DARK}}>
    {HAS_VOICE ? <Audio src={staticFile('voiceover.mp3')} /> : null}
    <Sequence from={0} durationInFrames={90}><Hook /></Sequence>
    {SITES.map((s, i) => (
      <Sequence key={s.name} from={90 + i * 65} durationInFrames={i === 2 ? 65 : 75}>
        <Showcase site={s} idx={i} dur={i === 2 ? 65 : 75} />
      </Sequence>
    ))}
    <Sequence from={285} durationInFrames={225}><Offer /></Sequence>
    <Sequence from={510} durationInFrames={90}><Outro /></Sequence>
    <Subtitles phrases={PHRASES} />
  </AbsoluteFill>
);
