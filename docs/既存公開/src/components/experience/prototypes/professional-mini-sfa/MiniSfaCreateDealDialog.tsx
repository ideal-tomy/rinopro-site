"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  CONFLICT_CHECK_STATUS_OPTIONS,
} from "@/lib/experience/professional-mini-sfa/constants";
import type { CreateDealInput } from "@/lib/experience/professional-mini-sfa/types";

interface MiniSfaCreateDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateDeal: (input: CreateDealInput) => void;
}

type FormState = CreateDealInput;

const INITIAL_FORM: FormState = {
  title: "",
  clientName: "",
  contactName: "",
  inquiryChannel: "Web",
  referrer: "",
  practiceArea: "企業法務",
  assignee: "高橋弁護士",
  nextAction: "",
  nextActionDate: "",
  summary: "",
  estimatedValueLabel: "",
  conflictCheckStatus: "未着手",
  note: "",
};

export function MiniSfaCreateDealDialog({
  open,
  onOpenChange,
  onCreateDeal,
}: MiniSfaCreateDealDialogProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const requiredMissing = useMemo(() => {
    const requiredValues = [
      form.title,
      form.clientName,
      form.contactName,
      form.inquiryChannel,
      form.practiceArea,
      form.assignee,
      form.nextAction,
      form.nextActionDate,
      form.summary,
    ];

    return requiredValues.some((value) => !value.trim());
  }, [form]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => setForm(INITIAL_FORM);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = () => {
    if (requiredMissing) return;
    onCreateDeal({
      ...form,
      referrer: form.referrer.trim() || form.inquiryChannel,
      estimatedValueLabel: form.estimatedValueLabel?.trim() || undefined,
      note: form.note?.trim() || undefined,
    });
    resetForm();
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-silver/20 bg-base-dark/95 p-0 text-text sm:max-w-2xl"
      >
        <div className="flex min-h-full flex-col">
          <SheetHeader className="border-b border-silver/20 px-5 py-4">
            <SheetTitle className="text-white">新規相談を追加</SheetTitle>
            <SheetDescription>
              架空データのままブラウザ内で保存されます。入力後は `相談受付` から開始します。
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-5 py-4">
            <label className="block space-y-1.5">
              <span className="text-[11px] font-medium text-text-sub md:text-sm">
                件名
              </span>
              <Input
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-text-sub md:text-sm">
                  顧客名
                </span>
                <Input
                  value={form.clientName}
                  onChange={(event) => setField("clientName", event.target.value)}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-text-sub md:text-sm">
                  担当窓口名
                </span>
                <Input
                  value={form.contactName}
                  onChange={(event) => setField("contactName", event.target.value)}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-text-sub md:text-sm">
                  流入経路
                </span>
                <select
                  value={form.inquiryChannel}
                  onChange={(event) => setField("inquiryChannel", event.target.value)}
                  className="flex h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-4 py-2 text-[1rem] text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                >
                  <option>Web</option>
                  <option>紹介</option>
                  <option>電話</option>
                  <option>メール</option>
                  <option>LINE</option>
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-text-sub md:text-sm">
                  紹介元
                </span>
                <Input
                  value={form.referrer}
                  onChange={(event) => setField("referrer", event.target.value)}
                  placeholder="例: 顧問税理士紹介"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-text-sub md:text-sm">
                  案件種別
                </span>
                <select
                  value={form.practiceArea}
                  onChange={(event) => setField("practiceArea", event.target.value)}
                  className="flex h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-4 py-2 text-[1rem] text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                >
                  <option>企業法務</option>
                  <option>労務</option>
                  <option>相続</option>
                  <option>顧問契約</option>
                  <option>許認可</option>
                  <option>IT・企業法務</option>
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-text-sub md:text-sm">
                  担当者
                </span>
                <select
                  value={form.assignee}
                  onChange={(event) => setField("assignee", event.target.value)}
                  className="flex h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-4 py-2 text-[1rem] text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                >
                  <option>高橋弁護士</option>
                  <option>林弁護士</option>
                  <option>中村弁護士</option>
                  <option>事務局</option>
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-text-sub md:text-sm">
                  利益相反確認
                </span>
                <select
                  value={form.conflictCheckStatus}
                  onChange={(event) =>
                    setField(
                      "conflictCheckStatus",
                      event.target.value as FormState["conflictCheckStatus"]
                    )
                  }
                  className="flex h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-4 py-2 text-[1rem] text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                >
                  {CONFLICT_CHECK_STATUS_OPTIONS.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-text-sub md:text-sm">
                  次アクション
                </span>
                <Input
                  value={form.nextAction}
                  onChange={(event) => setField("nextAction", event.target.value)}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-text-sub md:text-sm">
                  次回アクション日
                </span>
                <Input
                  type="date"
                  value={form.nextActionDate}
                  onChange={(event) => setField("nextActionDate", event.target.value)}
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-[11px] font-medium text-text-sub md:text-sm">
                相談概要
              </span>
              <Textarea
                value={form.summary}
                onChange={(event) => setField("summary", event.target.value)}
                className="min-h-[100px]"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-text-sub md:text-sm">
                  費用レンジメモ
                </span>
                <Input
                  value={form.estimatedValueLabel}
                  onChange={(event) =>
                    setField("estimatedValueLabel", event.target.value)
                  }
                  placeholder="例: 月額顧問 8万円前後"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-medium text-text-sub md:text-sm">
                  申し送り
                </span>
                <Textarea
                  value={form.note}
                  onChange={(event) => setField("note", event.target.value)}
                  className="min-h-[100px]"
                />
              </label>
            </div>

            {requiredMissing ? (
              <p className="text-xs text-amber-200/80">
                件名、顧客名、担当窓口、案件種別、担当者、次アクション、次回アクション日、相談概要は必須です。
              </p>
            ) : null}
          </div>

          <SheetFooter className="mt-auto border-t border-silver/20 px-5 py-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              閉じる
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={requiredMissing}>
              保存して相談を追加
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
