import { Observable } from 'rxjs';

export interface GetTeamsMatchesArgs {
  environment: string;
  teamIds: string[];
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

export interface GetTeamsMatchesResponse {
  data: GetTeamsMatchesData[];
}

export interface MatchesRPCService {
  getTeamsMatches(
    GetTeamsMatchesArgs: GetTeamsMatchesArgs,
  ): Observable<GetTeamsMatchesResponse>;
}
