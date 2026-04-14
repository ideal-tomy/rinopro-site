"use client";

import { DEAL_STAGE_LABEL } from "@/lib/experience/professional-mini-sfa/constants";
import type { ContactRow } from "@/lib/experience/professional-mini-sfa/types";

interface MiniSfaContactsTabProps {
  contacts: ContactRow[];
  onOpenDeal: (dealId: string) => void;
}

export function MiniSfaContactsTab({
  contacts,
  onOpenDeal,
}: MiniSfaContactsTabProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-silver/20">
      <table className="w-full min-w-[840px] text-left text-xs text-text md:text-[16px]">
        <thead className="border-b border-silver/20 bg-base-dark/90 text-text-sub">
          <tr>
            <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">顧客名</th>
            <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">担当窓口</th>
            <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">紹介元</th>
            <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">案件種別</th>
            <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">担当者</th>
            <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">最終接触日</th>
            <th className="px-2 py-1.5 font-medium md:px-3 md:py-2">現在ステージ</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              className="border-b border-silver/15 last:border-0 hover:bg-silver/5"
            >
              <td className="px-2 py-1.5 md:px-3 md:py-2">
                <button
                  type="button"
                  onClick={() => onOpenDeal(contact.id)}
                  className="text-left text-white/95 underline-offset-2 hover:text-accent hover:underline"
                >
                  {contact.clientName}
                </button>
              </td>
              <td className="px-2 py-1.5 md:px-3 md:py-2">{contact.contactName}</td>
              <td className="px-2 py-1.5 md:px-3 md:py-2">{contact.referrer}</td>
              <td className="px-2 py-1.5 md:px-3 md:py-2">{contact.practiceArea}</td>
              <td className="px-2 py-1.5 md:px-3 md:py-2">{contact.assignee}</td>
              <td className="px-2 py-1.5 text-text-sub md:px-3 md:py-2">
                {contact.lastContactAt}
              </td>
              <td className="px-2 py-1.5 md:px-3 md:py-2">
                {DEAL_STAGE_LABEL[contact.stage]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
