"use client";

import { useEffect, useMemo, useState } from "react";
import { DEAL_STAGE_ORDER } from "@/lib/experience/professional-mini-sfa/constants";
import { INITIAL_DEALS } from "@/lib/experience/professional-mini-sfa/mock-deals";
import {
  buildContactRows,
  buildDashboardStats,
} from "@/lib/experience/professional-mini-sfa/selectors";
import {
  readMiniSfaDeals,
  resetMiniSfaDeals,
  writeMiniSfaDeals,
} from "@/lib/experience/professional-mini-sfa/storage";
import type {
  ContactRow,
  CreateDealInput,
  DealCard,
  DealStageId,
  MiniSfaDashboardStats,
  TabId,
} from "@/lib/experience/professional-mini-sfa/types";

function createDealId(): string {
  const cryptoObject = globalThis.crypto;
  if (cryptoObject && "randomUUID" in cryptoObject) {
    return cryptoObject.randomUUID();
  }
  return `deal_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface UseProfessionalMiniSfaDemoResult {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  deals: DealCard[];
  contacts: ContactRow[];
  selectedDeal: DealCard | null;
  selectedDealId: string | null;
  setSelectedDealId: (id: string | null) => void;
  createDeal: (input: CreateDealInput) => void;
  updateDeal: (id: string, patch: Partial<DealCard>) => void;
  moveDealStage: (id: string, stage: DealStageId) => void;
  resetDemo: () => void;
  stats: MiniSfaDashboardStats;
  mobileBoardStage: DealStageId;
  setMobileBoardStage: (stage: DealStageId) => void;
  mobileDealDetailOpen: boolean;
  setMobileDealDetailOpen: (open: boolean) => void;
  mobileWeekFollowOpen: boolean;
  setMobileWeekFollowOpen: (open: boolean) => void;
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
}

export function useProfessionalMiniSfaDemo(): UseProfessionalMiniSfaDemoResult {
  const [activeTab, setActiveTabState] = useState<TabId>("dashboard");
  const [deals, setDeals] = useState<DealCard[]>(() => readMiniSfaDeals(INITIAL_DEALS));
  const [selectedDealId, setSelectedDealIdState] = useState<string | null>(
    () => readMiniSfaDeals(INITIAL_DEALS)[0]?.id ?? null
  );
  const [mobileBoardStage, setMobileBoardStage] = useState<DealStageId>(
    DEAL_STAGE_ORDER[0]
  );
  const [mobileDealDetailOpen, setMobileDealDetailOpen] = useState(false);
  const [mobileWeekFollowOpen, setMobileWeekFollowOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    writeMiniSfaDeals(deals);
  }, [deals]);

  const selectedDeal = useMemo(
    () => deals.find((deal) => deal.id === selectedDealId) ?? deals[0] ?? null,
    [deals, selectedDealId]
  );

  const contacts = useMemo(() => buildContactRows(deals), [deals]);
  const stats = useMemo(() => buildDashboardStats(deals), [deals]);

  const setActiveTab = (tab: TabId) => {
    setActiveTabState(tab);
    if (tab !== "board") {
      setMobileDealDetailOpen(false);
    }
    if (tab !== "dashboard") {
      setMobileWeekFollowOpen(false);
    }
  };

  const setSelectedDealId = (id: string | null) => {
    setSelectedDealIdState(id);
    if (!id) return;

    const nextSelected = deals.find((deal) => deal.id === id);
    if (nextSelected) {
      setMobileBoardStage(nextSelected.stage);
    }
  };

  const createDeal = (input: CreateDealInput) => {
    const now = new Date().toISOString().slice(0, 10);
    const newDeal: DealCard = {
      id: createDealId(),
      stage: "intake",
      lastContactAt: now,
      ...input,
    };

    setDeals((prev) => [newDeal, ...prev]);
    setSelectedDealIdState(newDeal.id);
    setActiveTab("board");
    setMobileBoardStage("intake");
    setCreateDialogOpen(false);
  };

  const updateDeal = (id: string, patch: Partial<DealCard>) => {
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === id
          ? {
              ...deal,
              ...patch,
              lastContactAt: patch.lastContactAt ?? deal.lastContactAt,
            }
          : deal
      )
    );
  };

  const moveDealStage = (id: string, stage: DealStageId) => {
    updateDeal(id, { stage });
  };

  const resetDemo = () => {
    const initialDeals = resetMiniSfaDeals();
    setDeals(initialDeals);
    setSelectedDealIdState(initialDeals[0]?.id ?? null);
    setActiveTabState("dashboard");
    setMobileBoardStage(DEAL_STAGE_ORDER[0]);
    setMobileDealDetailOpen(false);
    setMobileWeekFollowOpen(false);
    setCreateDialogOpen(false);
  };

  return {
    activeTab,
    setActiveTab,
    deals,
    contacts,
    selectedDeal,
    selectedDealId,
    setSelectedDealId,
    createDeal,
    updateDeal,
    moveDealStage,
    resetDemo,
    stats,
    mobileBoardStage,
    setMobileBoardStage,
    mobileDealDetailOpen,
    setMobileDealDetailOpen,
    mobileWeekFollowOpen,
    setMobileWeekFollowOpen,
    createDialogOpen,
    setCreateDialogOpen,
  };
}
