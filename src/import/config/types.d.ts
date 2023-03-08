import { PLAYER_ROLE, PLAYER_POSITION, FOOT } from '../../common/constants';
import { IPlayerRatings } from '../../common/types';

export interface ICSVTeamRow {
  name?: string;
  evaluation?: number;
  country?: string;
  region?: string;
  division?: number;
  isNational?: boolean;
}

export interface ICSVPlayerRow {
  team: string;
  firstName: string;
  lastName;
  country: string;
  age: number;
  evaluation: number;
  role: PLAYER_ROLE;
  position: PLAYER_POSITION;
  ratings: Partial<IPlayerRatings>;
  teamPosition: PLAYER_POSITION;
  features: string;
  foot: FOOT;
  height: number;
  photo: string;
}
