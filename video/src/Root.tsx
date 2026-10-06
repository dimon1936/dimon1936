import { Composition } from "remotion";
import { Profile, TOTAL } from "./Profile";

export const Root = () => (
  <Composition id="Profile" component={Profile} durationInFrames={TOTAL} fps={30} width={1280} height={720} />
);
