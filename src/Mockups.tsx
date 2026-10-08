import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {body, headline, mono} from './theme';
import {Logo} from './Logo';
import {Phrase, WordSubtitles} from './Subtitles';
import {BLACK, CREAM, SITES, Showcase, Slam, Tag, Tape, Wipe, clamp, outline, shake} from './Promo';

export const MOCKUPS_DURATION = 20 * 30; // 600 кадров

// Озвучка по сценам: public/audio/uni-mockups-scene1.mp3 … scene6.mp3
// (генерируется elevenlabs-remotion из scenes.json). Включить: true.
const HAS_VOICE = false;

const STARTS = [0, 90, 180, 345, 495, 555];

const PHRASES: Phrase[] = [
  {text: 'Не платите за сайт,', from: 0, to: 45},
  {text: 'пока не увидели макет.', from: 45, to: 90},
  {text: 'Мы нарисуем его бесплатно', from: 90, to: 135},
  {text: 'два макета под ваш бизнес.', from: 135, to: 180},
  {text: 'Вот сайты, которые мы уже сделали.', from: 180, to: 270},
  {text: 'Каждый под свой бизнес.', from: 270, to: 345},
  {text: 'Подпишитесь на нас', from: 345, to: 405},
  {text: 'и напишите плюс', from: 405, to: 450},
  {text: 'в комментариях.', from: 450, to: 495},
  {text: 'Каждому. Бесплатно.', from: 495, to: 555},
  {text: 'UNI. Ваша идея. Наш код.', from: 555, to: 600},
];

const draw = (frame: number, delay: number, dur = 24) => interpolate(frame - delay, [0, dur], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

const Line: React.FC<{d: string; delay: number; len?: number; w?: number; dur?: number}> = ({d, delay, len = 1200, w = 6, dur = 24}) => {
  const frame = useCurrentFrame();
  const t = draw(frame, delay, dur);
  return <path d={d} fill="none" stroke={CREAM} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - t)} />;
};

// Линейный макет сайта в стиле иллюстраций постов UNI
const Wireframe: React.FC<{delay?: number; variant?: 1 | 2; width?: number}> = ({delay = 0, variant = 1, width = 440}) => (
  <svg width={width} height={(width * 420) / 440} viewBox="0 0 440 420">
    <Line d="M10 10 H430 V410 H10 Z" delay={delay} len={1700} w={7} />
    <Line d="M10 62 H430" delay={delay + 6} len={420} />
    <circle cx={40} cy={36} r={7} fill={CREAM} />
    <circle cx={66} cy={36} r={7} fill={CREAM} />
    <circle cx={92} cy={36} r={7} fill={CREAM} />
    {variant === 1 ? (
      <>
        <Line d="M40 120 H250 M40 160 H200 M40 200 H230" delay={delay + 12} len={260} w={10} />
        <Line d="M40 260 H170 V310 H40 Z" delay={delay + 18} len={400} />
        <Line d="M290 110 H400 V250 H290 Z M290 250 L330 200 L355 230 L375 205 L400 250" delay={delay + 14} len={700} />
        <Line d="M40 350 H400" delay={delay + 24} len={380} w={5} />
      </>
    ) : (
      <>
        <Line d="M40 110 H400 V210 H40 Z" delay={delay + 12} len={900} />
        <Line d="M40 250 H190 V380 H40 Z M250 250 H400 V380 H250 Z" delay={delay + 18} len={1000} />
        <Line d="M60 170 H230" delay={delay + 24} len={190} w={10} />
      </>
    )}
  </svg>
);

// 1. Хук B: контрарный
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const sheetOut = interpolate(frame, [40, 62], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const strike = draw(frame, 28, 12);
  const wfIn = spring({frame: frame - 54, fps: 30, config: {damping: 14, stiffness: 140}});
  const flash = interpolate(frame, [44, 46, 56], [0, 0.85, 0], clamp);
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <AbsoluteFill style={{transform: shake(frame, [0, 12, 45])}}>
        <Tag />
        <div style={{position: 'absolute', top: 250, left: 80}}>
          {frame < 45 ? (
            <>
              <Slam from={0}>Не платите</Slam>
              <Slam from={12} fill={false}>за сайт</Slam>
            </>
          ) : (
            <>
              <Slam from={45} fill={false}>пока не</Slam>
              <Slam from={52}>увидели</Slam>
              <Slam from={60} fill={false}>макет</Slam>
            </>
          )}
        </div>
        {/* договор — вправо и прочь */}
        <div style={{position: 'absolute', left: 190, top: 1090, transform: `translateX(${sheetOut * 1100}px) rotate(${-4 + sheetOut * 18}deg)`}}>
          <svg width={460} height={440} viewBox="0 0 460 440">
            <rect x={6} y={6} width={448} height={428} fill={BLACK} stroke={CREAM} strokeWidth={6} />
            <text x={36} y={64} fontFamily={mono} fontSize={30} letterSpacing={6} fill={CREAM}>ДОГОВОР</text>
            <path d="M36 110 H420 M36 150 H380 M36 190 H410 M36 230 H320" stroke={CREAM} strokeWidth={5} opacity={0.6} />
            <path d="M36 380 H200 M60 360 C80 330 110 400 150 350" fill="none" stroke={CREAM} strokeWidth={5} />
            <path d="M40 60 L420 400 M420 60 L40 400" stroke={CREAM} strokeWidth={14} strokeLinecap="round" strokeDasharray={520} strokeDashoffset={520 * (1 - strike)} />
          </svg>
        </div>
        {/* макет приезжает */}
        <div style={{position: 'absolute', left: 190, top: 1090, transform: `translateY(${(1 - wfIn) * 500}px) scale(${0.8 + wfIn * 0.2})`, opacity: wfIn}}>
          <Wireframe delay={56} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: CREAM, opacity: flash}} />
    </AbsoluteFill>
  );
};

// 2. Мы нарисуем бесплатно, два макета
const TwoMockups: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const block = spring({frame: frame - 4, fps, config: {damping: 12, stiffness: 220}});
  const a = spring({frame: frame - 36, fps, config: {damping: 14, stiffness: 130}});
  const b = spring({frame: frame - 52, fps, config: {damping: 14, stiffness: 130}});
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <Tag />
      <div style={{position: 'absolute', top: 230, left: 80, right: 80}}>
        <div style={{display: 'inline-block', background: CREAM, color: BLACK, fontFamily: headline, fontWeight: 700, fontSize: 160, lineHeight: 1, padding: '10px 36px 0', textTransform: 'uppercase', transform: `scaleX(${block})`, transformOrigin: 'left'}}>бесплатно</div>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 150, color: CREAM, textTransform: 'uppercase', lineHeight: 1, marginTop: 28}}>2 макета</div>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 110, textTransform: 'uppercase', lineHeight: 1, whiteSpace: 'nowrap', ...outline(3)}}>под ваш бизнес</div>
      </div>
      <div style={{position: 'absolute', left: 50, top: 1120, transform: `translateY(${(1 - a) * 600}px) rotate(${-5 * a}deg)`, opacity: a}}>
        <Wireframe delay={38} variant={1} width={470} />
      </div>
      <div style={{position: 'absolute', left: 560, top: 1160, transform: `translateY(${(1 - b) * 600}px) rotate(${5 * b}deg)`, opacity: b}}>
        <Wireframe delay={54} variant={2} width={470} />
      </div>
      <div style={{position: 'absolute', top: 1060, left: 80, fontFamily: mono, fontWeight: 500, fontSize: 30, letterSpacing: 6, color: CREAM, opacity: 0.8}}>МАКЕТ 01 / 02</div>
    </AbsoluteFill>
  );
};

// 4. Два шага
const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const arrow = draw(frame, 24, 30);
  const card = (n: string, text: string, delay: number, plus?: boolean) => {
    const p = spring({frame: frame - delay, fps, config: {damping: 15, stiffness: 150}});
    const pulse = plus ? 1 + Math.max(0, Math.sin((frame - delay) / 4)) * 0.04 : 1;
    return (
      <div key={n} style={{display: 'flex', alignItems: 'center', gap: 36, transform: `translateX(${(1 - p) * 1000}px) scale(${pulse})`, border: `4px solid ${CREAM}`, borderRadius: 24, padding: '24px 36px', background: plus ? CREAM : BLACK}}>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 110, color: plus ? BLACK : CREAM, lineHeight: 1}}>{n}</div>
        <div style={{fontFamily: body, fontWeight: 800, fontSize: 50, color: plus ? BLACK : CREAM, lineHeight: 1.15}}>{text}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <Tag />
      <div style={{position: 'absolute', top: 230, left: 80, right: 80}}>
        <Slam from={2} size={190}>2 шага</Slam>
        <Slam from={10} fill={false} size={120}>к вашему макету</Slam>
      </div>
      <svg style={{position: 'absolute', left: 80, top: 700}} width={920} height={120} viewBox="0 0 920 120">
        <path d="M0 60 H860 M820 20 L880 60 L820 100" fill="none" stroke={CREAM} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1100} strokeDashoffset={1100 * (1 - arrow)} />
      </svg>
      <div style={{position: 'absolute', top: 1110, left: 80, right: 80, display: 'flex', flexDirection: 'column', gap: 24}}>
        {card('1', 'Подпишись на @uni___web', 6)}
        {card('2', 'Напиши «+» в комментариях', 60, true)}
      </div>
    </AbsoluteFill>
  );
};

// 5. Каждому. Бесплатно.
const Payoff: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const block = spring({frame: frame - 14, fps, config: {damping: 12, stiffness: 220}});
  const fan = spring({frame: frame - 6, fps, config: {damping: 13, stiffness: 120}});
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <AbsoluteFill style={{transform: shake(frame, [0, 14])}}>
        <Tag />
        <div style={{position: 'absolute', top: 240, left: 80, right: 80}}>
          <Slam from={0} size={230}>каждому</Slam>
          <div style={{display: 'inline-block', background: CREAM, color: BLACK, fontFamily: headline, fontWeight: 700, fontSize: 160, lineHeight: 1, padding: '10px 36px 0', marginTop: 20, textTransform: 'uppercase', transform: `scaleX(${block})`, transformOrigin: 'left'}}>бесплатно</div>
        </div>
        <div style={{position: 'absolute', left: 150, top: 1130, transform: `rotate(${-10 * fan}deg) translateX(${-90 * fan}px)`}}>
          <Wireframe delay={8} variant={1} width={470} />
        </div>
        <div style={{position: 'absolute', left: 470, top: 1130, transform: `rotate(${10 * fan}deg) translateX(${90 * fan}px)`}}>
          <Wireframe delay={14} variant={2} width={470} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 6. Финал
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 12, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <div style={{position: 'absolute', top: 200, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${1 + frame * 0.0015})`}}>
        <Logo color={CREAM} width={620} delay={0} />
      </div>
      <div style={{position: 'absolute', top: 1130, left: 0, right: 0, textAlign: 'center', color: CREAM, opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 130, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>Ваша идея.</div>
        <div style={{fontFamily: headline, fontWeight: 700, fontSize: 130, textTransform: 'uppercase', whiteSpace: 'nowrap', ...outline(3)}}>Наш код.</div>
        <div style={{fontFamily: mono, fontSize: 50, fontWeight: 500, marginTop: 30, letterSpacing: 2}}>@uni___web</div>
      </div>
    </AbsoluteFill>
  );
};

export const Mockups: React.FC = () => (
  <AbsoluteFill style={{background: BLACK}}>
    {HAS_VOICE
      ? STARTS.map((s, i) => (
          <Sequence key={i} from={s}>
            <Audio src={staticFile(`audio/uni-mockups-scene${i + 1}.mp3`)} />
          </Sequence>
        ))
      : null}
    <Sequence from={0} durationInFrames={90}><Hook /></Sequence>
    <Sequence from={90} durationInFrames={90}><TwoMockups /></Sequence>
    {SITES.map((s, i) => (
      <Sequence key={s.name} from={180 + i * 55} durationInFrames={55}>
        <Showcase site={s} idx={i} dur={55} />
      </Sequence>
    ))}
    <Sequence from={345} durationInFrames={150}><Steps /></Sequence>
    <Sequence from={495} durationInFrames={60}><Payoff /></Sequence>
    <Sequence from={555} durationInFrames={45}><Outro /></Sequence>
    {[90, 180, 235, 290, 345, 495, 555].map((b) => (
      <Sequence key={b} from={b - 6} durationInFrames={12}><Wipe /></Sequence>
    ))}
    <WordSubtitles phrases={PHRASES} />
  </AbsoluteFill>
);
