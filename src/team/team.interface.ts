import { Observable } from 'rxjs';

export interface GetTeamsMatchesArgs {
  environment: string;
  teamIds: string[];
}

export interface GetPlayersMatchesArgs {
  environment: string;
  playerIds: string[];
}

export interface GetTeamsMatchesData {
  teamId: string;
  wins: number;
  draws: number;
  loses: number;
  goals: number;
  goalsAgainst: number;
  goalsDifference: number;
}

export interface GetPlayersMatchesData {
  playerId: string;
  goals: number;
  assists: number;
  matches: number;
}

export interface GetTeamsMatchesResponse {
  data: GetTeamsMatchesData[];
}

export interface GetPlayersMatchesResponse {
  data: GetPlayersMatchesData[];
}

export interface MatchesRPCService {
  getTeamsMatches(
    GetTeamsMatchesArgs: GetTeamsMatchesArgs,
  ): Observable<GetTeamsMatchesResponse>;

  getPlayersMatches(
    GetTeamsMatchesArgs: GetPlayersMatchesArgs,
  ): Observable<GetPlayersMatchesResponse>;
}
