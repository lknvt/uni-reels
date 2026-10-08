import React from 'react';
import {interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ACCENT, LIGHT, body} from './theme';

export type Phrase = {text: string; from: number; to: number};

export const PHRASES: Phrase[] = [
  {text: 'Вашему бизнесу', from: 0, to: 45},
  {text: 'нужен сайт?', from: 45, to: 90},
  {text: 'Создаём сайты', from: 90, to: 135},
  {text: 'под ключ', from: 135, to: 180},
  {text: 'Дизайн, разработка', from: 180, to: 235},
  {text: 'и SEO-оптимизация', from: 235, to: 295},
  {text: 'Чат-боты для продаж 24/7', from: 295, to: 360},
  {text: 'Ваша идея. Наш код.', from: 360, to: 405},
  {text: 'Пишите нам в WhatsApp', from: 405, to: 450},
];

const Caption: React.FC<{phrase: Phrase; mono?: boolean}> = ({phrase, mono}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = phrase.text.split(' ');
  const dur = phrase.to - phrase.from;
  const pop = spring({frame, fps, config: {damping: 14, stiffness: 180}, durationInFrames: 14});
  const fadeOut = interpolate(frame, [dur - 4, dur], [1, 0], {extrapolateLeft: 'clamp'});
  const active = Math.min(words.length - 1, Math.floor((frame / dur) * words.length));
  return (
    <div
      style={{
        transform: `translateY(${(1 - pop) * 30}px) scale(${0.92 + pop * 0.08})`,
        opacity: Math.min(pop, 1) * fadeOut,
        background: mono ? '#000' : 'rgba(18,20,25,0.92)',
        border: '2px solid rgba(237,235,230,0.18)',
        borderRadius: 28,
        padding: '22px 38px',
        fontFamily: body,
        fontWeight: 800,
        fontSize: 58,
        lineHeight: 1.15,
        textAlign: 'center',
        maxWidth: 940,
        color: LIGHT,
      }}
    >
      {words.map((w, i) => (
        <span key={i} style={mono ? {background: i === active ? LIGHT : 'transparent', color: i === active ? '#000' : LIGHT, padding: '0 10px', borderRadius: 10} : {color: i === active ? ACCENT : LIGHT}}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </div>
  );
};

export const Subtitles: React.FC<{phrases?: Phrase[]; mono?: boolean}> = ({phrases = PHRASES, mono}) => {
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 300, display: 'flex', justifyContent: 'center'}}>
      {phrases.map((p) => (
        <Sequence key={p.from} from={p.from} durationInFrames={p.to - p.from} layout="none">
          <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <Caption phrase={p} mono={mono} />
          </div>
        </Sequence>
      ))}
    </div>
  );
};
