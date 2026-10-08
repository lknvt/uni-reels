import {Composition} from 'remotion';
import {Reel} from './Reel';
import {Promo, PROMO_DURATION} from './Promo';
import {Mockups, MOCKUPS_DURATION} from './Mockups';
import {FPS, DURATION} from './theme';

export const Root: React.FC = () => (
  <>
  <Composition
    id="UniReel"
    component={Reel}
    durationInFrames={DURATION}
    fps={FPS}
    width={1080}
    height={1920}
  />
    <Composition id="UniPromo" component={Promo} durationInFrames={PROMO_DURATION} fps={FPS} width={1080} height={1920} />
    <Composition id="UniMockups" component={Mockups} durationInFrames={MOCKUPS_DURATION} fps={FPS} width={1080} height={1920} />
  </>
);
