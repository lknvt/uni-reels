import {continueRender, delayRender, staticFile} from 'remotion';

export const FPS = 30;
export const DURATION = 15 * FPS; // 450

export const DARK = '#121419';
export const LIGHT = '#EDEBE6';
export const ACCENT = '#4DA3FF';

export const headline = 'UniOswald';
export const body = 'UniMontserrat';
export const mono = 'UniMono';

const CYR = 'U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116';
const LAT = 'U+0000-00FF,U+0131,U+0152-0153,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215';

// Шрифты лежат в public/fonts (офлайн-рендер, без запросов к Google Fonts)
const faces: [string, string, string, string][] = [
  [headline, '700', 'oswald-cyrillic-700-normal.woff2', CYR],
  [headline, '700', 'oswald-latin-700-normal.woff2', LAT],
  [body, '800', 'montserrat-cyrillic-800-normal.woff2', CYR],
  [body, '800', 'montserrat-latin-800-normal.woff2', LAT],
  [body, '600', 'montserrat-cyrillic-600-normal.woff2', CYR],
  [body, '600', 'montserrat-latin-600-normal.woff2', LAT],
  [mono, '500', 'jetbrains-mono-cyrillic-500-normal.woff2', CYR],
  [mono, '500', 'jetbrains-mono-latin-500-normal.woff2', LAT],
];

const handle = delayRender('Loading fonts');
Promise.all(
  faces.map(async ([family, weight, file, range]) => {
    const face = new FontFace(family, `url(${staticFile('fonts/' + file)}) format('woff2')`, {weight, unicodeRange: range});
    await face.load();
    document.fonts.add(face);
  }),
)
  .then(() => continueRender(handle))
  .catch((e) => {
    console.error(e);
    continueRender(handle);
  });
