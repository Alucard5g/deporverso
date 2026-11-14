import stadiumBroadcastImg from '../assets/images/cine_stadium_broadcast_1794663345650.jpg';
import varBoothImg from '../assets/images/cine_var_booth_1794663346004.jpg';
import goalMomentImg from '../assets/images/cine_goal_moment_1794663346400.jpg';
import clubTunnelImg from '../assets/images/cine_club_tunnel_1794663346638.jpg';
import athletePortraitA from '../assets/images/cine_athlete_portrait_a_1794663346781.jpg';
import athletePortraitB from '../assets/images/cine_athlete_portrait_b_1794663347310.jpg';
import athletePortraitC from '../assets/images/cine_athlete_portrait_c_1794663347812.jpg';

export const CINEMATIC_ASSETS = {
  stadiumBroadcast: stadiumBroadcastImg,
  varBooth: varBoothImg,
  goalMoment: goalMomentImg,
  clubTunnel: clubTunnelImg,
  athletePortraits: [athletePortraitA, athletePortraitB, athletePortraitC] as const,
};

export function getAthletePortrait(seed: string = '0'): string {
  let sum = 0;
  for (let i = 0; i < seed.length; i++) {
    sum += seed.charCodeAt(i);
  }
  const portraits = CINEMATIC_ASSETS.athletePortraits;
  return portraits[Math.abs(sum) % portraits.length];
}
