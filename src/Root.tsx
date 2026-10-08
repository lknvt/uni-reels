import {Composition} from 'remotion';
import {Reel} from './Reel';
import {FPS, DURATION} from './theme';

export const Root: React.FC = () => (
  <Composition
    id="UniReel"
    component={Reel}
    durationInFrames={DURATION}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
