import { INITIAL_DEALS } from "./mock-deals";
import { buildContactRows } from "./selectors";
import type { ContactRow } from "./types";

export const MOCK_CONTACTS: ContactRow[] = buildContactRows(INITIAL_DEALS);
