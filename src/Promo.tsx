import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {body, headline, mono} from './theme';
import {Logo} from './Logo';
import {Phrase, WordSubtitles} from './Subtitles';

export const PROMO_DURATION = 20 * 30; // 600 кадров

// Положите озвучку в public/voiceover.mp3 и поставьте true.
const HAS_VOICE = false;

export const BLACK = '#000000';
export const CREAM = '#EDEBE6';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

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

export const outline = (w = 3): React.CSSProperties => ({color: 'transparent', WebkitTextStroke: `${w}px ${CREAM}`});

// Метка UNI в углу, как на постах
export const Tag: React.FC = () => (
  <div style={{position: 'absolute', top: 120, left: 80, fontFamily: mono, fontWeight: 500, fontSize: 40, letterSpacing: 10, color: CREAM}}>UNI</div>
);

// Бегущая лента
export const Tape: React.FC<{text: string; top: number; rot: number; dir?: 1 | -1; inverted?: boolean; size?: number}> = ({text, top, rot, dir = 1, inverted = true, size = 84}) => {
  const frame = useCurrentFrame();
  const unit = `${text}  ✦  `;
  const item = Array.from({length: 8}).map(() => unit).join('');
  return (
    <div style={{position: 'absolute', left: -200, width: 1500, top, transform: `rotate(${rot}deg)`, background: inverted ? CREAM : BLACK, borderBlock: inverted ? 'none' : `3px solid ${CREAM}`, overflow: 'hidden', padding: '14px 0'}}>
      <div style={{fontFamily: headline, fontWeight: 700, fontSize: size, textTransform: 'uppercase', whiteSpace: 'nowrap', color: inverted ? BLACK : CREAM, transform: `translateX(${-300 + dir * ((frame * 14) % 1400) * -1}px)`}}>{item}</div>
    </div>
  );
};

// Удар: слово влетает крупно и «садится»
export const Slam: React.FC<{children: string; from: number; fill?: boolean; size?: number}> = ({children, from, fill = true, size = 190}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - from, fps, config: {damping: 11, stiffness: 300}, durationInFrames: 12});
  if (frame < from) return <div style={{height: size * 0.95}} />;
  return (
    <div style={{fontFamily: headline, fontWeight: 700, fontSize: size, lineHeight: 0.95, whiteSpace: 'nowrap', textTransform: 'uppercase', transform: `scale(${1.6 - 0.6 * p})`, opacity: Math.min(1, p * 3), transformOrigin: 'left center', ...(fill ? {color: CREAM} : outline(4))}}>
      {children}
    </div>
  );
};

// Затухающая тряска камеры от ударов
export const shake = (frame: number, hits: number[]) => {
  let x = 0;
  let y = 0;
  for (const h of hits) {
    const d = frame - h;
    if (d >= 0 && d < 14) {
      const a = Math.exp(-d / 3.5) * 22;
      x += Math.sin(d * 5.3) * a;
      y += Math.cos(d * 6.1) * a;
    }
  }
  return `translate(${x}px, ${y}px)`;
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = 1 + frame * 0.0012;
  const flash = interpolate(frame, [55, 57, 68], [0, 0.9, 0], clamp);
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <AbsoluteFill style={{transform: `${shake(frame, [0, 12, 24, 56])} scale(${zoom})`}}>
        <div style={{position: 'absolute', left: -560, top: 560, opacity: 0.1}}>
          <Logo color={CREAM} width={2000} delay={0} />
        </div>
        <Tag />
        <div style={{position: 'absolute', top: 280, left: 80}}>
          <Slam from={0}>Ваш сайт</Slam>
          <Slam from={12} fill={false}>теряет</Slam>
          <Slam from={24}>клиентов</Slam>
        </div>
        <div style={{position: 'absolute', top: 920, left: 80, right: 80, display: 'flex', flexWrap: 'wrap', gap: 28}}>
          {Array.from({length: 12}).map((_, i) => {
            const leave = interpolate(frame, [38 + i * 3, 62 + i * 3], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
            const appear = interpolate(frame, [30 + i * 1.5, 38 + i * 1.5], [0, 1], clamp);
            return (
              <svg key={i} width={110} height={130} viewBox="0 0 110 130" style={{opacity: appear * (1 - leave), transform: `translate(${leave * (i % 2 ? 200 : -200)}px, ${-leave * 120}px) rotate(${leave * (i % 2 ? 40 : -40)}deg)`}}>
                <circle cx={55} cy={34} r={24} fill={CREAM} />
                <path d="M10 125 C10 80 100 80 100 125 Z" fill={CREAM} />
              </svg>
            );
          })}
        </div>
        <div style={{position: 'absolute', top: 1230, left: 80}}>
          <Slam from={56} size={118}>каждый день.</Slam>
        </div>
        <div style={{position: 'absolute', top: 1120, left: 80, fontFamily: mono, fontWeight: 500, fontSize: 34, letterSpacing: 4, color: CREAM, opacity: interpolate(frame, [36, 42], [0, 0.8], clamp)}}>
          КЛИЕНТОВ УШЛО: {String(Math.min(12, Math.max(0, Math.floor((frame - 38) / 3)))).padStart(2, '0')}
        </div>
        <Tape text="теряет клиентов" top={1010} rot={-5} dir={-1} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: CREAM, opacity: flash}} />
    </AbsoluteFill>
  );
};

export type Site = {img: string; desk: string; name: string; tag: string; scroll: number; chips: [string, string]};
export const SITES: Site[] = [
  {img: 'shots/archa.jpg', desk: 'shots/desk-archa.jpg', name: 'АРЧА', tag: 'Стрижка растений', scroll: 900, chips: ['Тёмный премиум', 'Заявка в WhatsApp']},
  {img: 'shots/toefl.jpg', desk: 'shots/desk-toefl.jpg', name: 'TOEFL', tag: 'Языковой центр', scroll: 900, chips: ['Тест уровня', 'Запись в WhatsApp']},
  {img: 'shots/tirazh.jpg', desk: 'shots/desk-tirazh.jpg', name: 'TIRAZH', tag: 'Полиграфия и мерч', scroll: 900, chips: ['Каталог работ', 'Расчёт тиража']},
];

export const PHONE_W = 330;
export const PHONE_H = 690;
const DESK_W = 960;
const DESK_H = 640;
const BAR = 54;

export const Chip: React.FC<{text: string; delay: number; left?: number; right?: number; top: number}> = ({text, delay, left, right, top}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 13, stiffness: 180}});
  const float = Math.sin((frame + delay) / 9) * 8;
  return (
    <div style={{position: 'absolute', top: top + float, left, right, transform: `scale(${p})`, background: CREAM, color: BLACK, fontFamily: body, fontWeight: 800, fontSize: 38, padding: '18px 30px', borderRadius: 60, whiteSpace: 'nowrap'}}>
      {text}
    </div>
  );
};

export const Showcase: React.FC<{site: Site; idx: number; dur: number}> = ({site, idx, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame, fps, config: {damping: 16, stiffness: 110}});
  const phoneP = spring({frame: frame - 10, fps, config: {damping: 14, stiffness: 120}});
  const t = interpolate(frame, [6, dur - 4], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const dirSign = idx % 2 ? -1 : 1;
  const bgX = interpolate(frame, [0, dur], [dirSign * 40, dirSign * -260]);
  const deskScale = (DESK_W - 16) / 1440;
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <Tag />
      <div style={{position: 'absolute', top: 120, right: 80, fontFamily: mono, fontWeight: 500, fontSize: 36, letterSpacing: 6, color: CREAM}}>0{idx + 1} / 03</div>
      <div style={{position: 'absolute', top: 700, left: 0, fontFamily: headline, fontWeight: 700, fontSize: 520, lineHeight: 1, whiteSpace: 'nowrap', textTransform: 'uppercase', transform: `translateX(${bgX}px)`, opacity: 0.45, ...outline(3)}}>
        {site.name}
      </div>
      {/* десктопная версия в окне браузера */}
      <div style={{position: 'absolute', left: (1080 - DESK_W) / 2, top: 250, width: DESK_W, height: DESK_H, perspective: 2200}}>
        <div
          style={{
            width: '100%',
            height: '100%',
            border: `6px solid ${CREAM}`,
            borderRadius: 26,
            background: '#0b0c10',
            overflow: 'hidden',
            transform: `rotateX(${(1 - inP) * 28}deg) translateY(${(1 - inP) * -300}px) scale(${0.85 + inP * 0.15 + frame * 0.0008})`,
            opacity: Math.min(1, inP * 2),
          }}
        >
          <div style={{height: BAR, borderBottom: `4px solid ${CREAM}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', background: BLACK}}>
            {[0, 1, 2].map((i) => <div key={i} style={{width: 14, height: 14, borderRadius: 7, background: CREAM}} />)}
            <div style={{marginLeft: 20, flex: 1, height: 26, borderRadius: 13, border: `2px solid ${CREAM}`, opacity: 0.55}} />
          </div>
          <div style={{position: 'relative', height: DESK_H - BAR - 12, overflow: 'hidden'}}>
            <Img src={staticFile(site.desk)} style={{width: DESK_W - 16, position: 'absolute', left: 0, top: -t * site.scroll * 0.8}} />
          </div>
        </div>
      </div>
      {/* мобильная версия поверх */}
      <div style={{position: 'absolute', left: 660, top: 760, width: PHONE_W, height: PHONE_H, perspective: 1600}}>
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 54,
            background: '#0b0c10',
            border: `7px solid ${CREAM}`,
            overflow: 'hidden',
            boxShadow: `0 0 0 6px ${BLACK}, 0 40px 80px rgba(237,235,230,0.12)`,
            transform: `translateY(${(1 - phoneP) * 700}px) rotateY(${(1 - phoneP) * -40}deg) rotate(${(1 - phoneP) * 8}deg)`,
          }}
        >
          <Img src={staticFile(site.img)} style={{width: PHONE_W - 14, position: 'absolute', left: 0, top: -t * site.scroll * 0.55}} />
        </div>
      </div>
      <Chip text={site.chips[0]} delay={18} left={50} top={1130} />
      <Chip text={site.chips[1]} delay={28} left={50} top={1250} />
      <div style={{position: 'absolute', top: 1560, left: 50, width: 580, fontFamily: mono, fontWeight: 500, fontSize: 30, color: CREAM, opacity: 0.7, letterSpacing: 4, textTransform: 'uppercase'}}>{site.name} · ПК + МОБИЛЬНАЯ</div>
    </AbsoluteFill>
  );
};

const Offer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const block = spring({frame: frame - 2, fps, config: {damping: 12, stiffness: 220}});
  const pulse = 1 + Math.sin(frame / 4) * 0.015;
  const card = (n: string, text: string, delay: number) => {
    const p = spring({frame: frame - delay, fps, config: {damping: 15, stiffness: 150}});
    return (
      <div key={n} style={{display: 'flex', alignItems: 'center', gap: 36, transform: `translateX(${(1 - p) * 1000}px)`, border: `4px solid ${CREAM}`, borderRadius: 24, padding: '22px 36px'}}>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 100, color: CREAM, lineHeight: 1}}>{n}</div>
        <div style={{fontFamily: body, fontWeight: 800, fontSize: 52, color: CREAM, lineHeight: 1.15}}>{text}</div>
      </div>
    );
  };
  const draw = interpolate(frame, [30, 60], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <Tag />
      <Tape text="бесплатный дизайн-макет" top={1580} rot={0} size={64} inverted={false} />
      <div style={{position: 'absolute', top: 230, left: 80, right: 80, transform: `scale(${pulse})`, transformOrigin: 'left top'}}>
        <div style={{display: 'inline-block', background: CREAM, color: BLACK, fontFamily: headline, fontWeight: 700, fontSize: 160, lineHeight: 1, padding: '10px 36px 0', textTransform: 'uppercase', transform: `scaleX(${block})`, transformOrigin: 'left'}}>бесплатно</div>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 118, color: CREAM, textTransform: 'uppercase', lineHeight: 1, marginTop: 30, whiteSpace: 'nowrap'}}>дизайн-макет</div>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 118, textTransform: 'uppercase', lineHeight: 1, whiteSpace: 'nowrap', ...outline(3)}}>вашего сайта</div>
      </div>
      <svg style={{position: 'absolute', left: 80, top: 720}} width={920} height={120} viewBox="0 0 920 120">
        <path d="M0 60 H860 M820 20 L880 60 L820 100" fill="none" stroke={CREAM} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1100} strokeDashoffset={1100 * (1 - draw)} />
      </svg>
      <div style={{position: 'absolute', top: 1110, left: 80, right: 80, display: 'flex', flexDirection: 'column', gap: 24}}>
        {card('1', 'Подпишись на @uni___web', 18)}
        {card('2', 'Напиши «+» в комментариях', 34)}
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 26, fps, config: {damping: 200}});
  const zoom = 1 + frame * 0.0015;
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <div style={{position: 'absolute', top: 200, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${zoom})`}}>
        <Logo color={CREAM} width={620} delay={2} />
      </div>
      <div style={{position: 'absolute', top: 1130, left: 0, right: 0, textAlign: 'center', color: CREAM, opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 130, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>Ваша идея.</div>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 130, textTransform: 'uppercase', whiteSpace: 'nowrap', ...outline(3)}}>Наш код.</div>
        <div style={{fontFamily: mono, fontSize: 50, fontWeight: 500, marginTop: 30, letterSpacing: 2}}>@uni___web</div>
      </div>
    </AbsoluteFill>
  );
};

// Кремовая шторка на стыках сцен
export const Wipe: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 14], [-100, 100], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return <AbsoluteFill style={{background: CREAM, transform: `translateX(${x}%) skewX(-8deg)`}} />;
};

export const Promo: React.FC = () => (
  <AbsoluteFill style={{background: BLACK}}>
    {HAS_VOICE ? <Audio src={staticFile('voiceover.mp3')} /> : null}
    <Sequence from={0} durationInFrames={90}><Hook /></Sequence>
    {SITES.map((s, i) => (
      <Sequence key={s.name} from={90 + i * 65} durationInFrames={65}>
        <Showcase site={s} idx={i} dur={65} />
      </Sequence>
    ))}
    <Sequence from={285} durationInFrames={225}><Offer /></Sequence>
    <Sequence from={510} durationInFrames={90}><Outro /></Sequence>
    {[90, 155, 220, 285, 510].map((b) => (
      <Sequence key={b} from={b - 7} durationInFrames={14}><Wipe /></Sequence>
    ))}
    <WordSubtitles phrases={PHRASES} />
  </AbsoluteFill>
);
