import { Player } from '../player/schemas/player.schema';
import { SortBy } from '../common/types';

export const resObj = (payload: any) => {
  const success = payload?.success || true;
  const message = payload?.message || true;
  let data = {};
  let _;
  if (payload) {
    ({ success: _, message: _, ...data } = payload);
  }

  return {
    success,
    message,
    data,
  };
};

export const getSortPlayersBy = (
  sortByField: string | undefined,
): SortBy<Player> => {
  switch (sortByField) {
    case 'evaluation':
    default:
      return 'evaluation';
  }
};
