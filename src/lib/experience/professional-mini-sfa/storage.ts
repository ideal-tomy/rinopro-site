"use client";

import { INITIAL_DEALS } from "./mock-deals";
import {
  MINI_SFA_STORAGE_KEY,
  MINI_SFA_STORAGE_VERSION,
} from "./constants";
import type { DealCard, MiniSfaStoragePayload } from "./types";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function isValidDealArray(value: unknown): value is DealCard[] {
  return Array.isArray(value);
}

function buildPayload(deals: DealCard[]): MiniSfaStoragePayload {
  return {
    version: MINI_SFA_STORAGE_VERSION,
    deals,
  };
}

export function readMiniSfaStorage(): MiniSfaStoragePayload | null {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(MINI_SFA_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<MiniSfaStoragePayload> | DealCard[];
    if (Array.isArray(parsed)) {
      return buildPayload(parsed);
    }

    if (
      parsed?.version === MINI_SFA_STORAGE_VERSION &&
      isValidDealArray(parsed.deals)
    ) {
      return {
        version: MINI_SFA_STORAGE_VERSION,
        deals: parsed.deals,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function readMiniSfaDeals(fallback = INITIAL_DEALS): DealCard[] {
  const payload = readMiniSfaStorage();
  return payload?.deals ?? fallback;
}

export function writeMiniSfaDeals(deals: DealCard[]): void {
  if (!canUseStorage()) return;

  window.localStorage.setItem(
    MINI_SFA_STORAGE_KEY,
    JSON.stringify(buildPayload(deals))
  );
}

export function resetMiniSfaDeals(): DealCard[] {
  if (canUseStorage()) {
    window.localStorage.removeItem(MINI_SFA_STORAGE_KEY);
  }
  return INITIAL_DEALS;
}
