import { DEAL_STAGE_LABEL } from "./constants";
import {
  getActiveDeals,
  getDealsDueThisWeek,
  getOverdueDeals,
  getStageCounts,
} from "./selectors";

export const activeDeals = getActiveDeals;
export const dealsDueThisWeek = getDealsDueThisWeek;
export const overdueDeals = getOverdueDeals;
export const stageCounts = getStageCounts;

export { DEAL_STAGE_LABEL };
