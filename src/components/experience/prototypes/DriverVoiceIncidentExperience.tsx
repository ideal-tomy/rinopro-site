"use client";

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  buildIncidentDraft,
  buildShipperMemo,
  emptyAssignments,
  fragmentWeights,
  INCIDENT_LANES,
  type IncidentLaneId,
  type LaneAssignments,
  type TranscriptFragment,
  splitTranscriptMock,
} from "@/lib/experience/driver-incident-mock";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

const POOL_ID = "pool";

interface DriverVoiceIncidentExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

function laneForFragment(
  assignments: LaneAssignments,
  fragmentId: string
): IncidentLaneId | null {
  for (const { id } of INCIDENT_LANES) {
    if (assignments[id] === fragmentId) return id;
  }
  return null;
}

function clearFragmentFromLanes(
  assignments: LaneAssignments,
  fragmentId: string
): LaneAssignments {
  const next = { ...assignments };
  for (const { id } of INCIDENT_LANES) {
    if (next[id] === fragmentId) next[id] = null;
  }
  return next;
}

function pseudoBarHeights(count: number, seed: number): number[] {
  const out: number[] = [];
  let s = seed || 1;
  for (let i = 0; i < count; i++) {
    s = (s * 9301 + 49297) % 233280;
    out.push(28 + (s % 48));
  }
  return out;
}

function PseudoWaveform({
  barCount,
  seed,
  reduceMotion,
}: {
  barCount: number;
  seed: number;
  reduceMotion: boolean;
}) {
  const heights = useMemo(
    () => pseudoBarHeights(barCount, seed),
    [barCount, seed]
  );
  return (
    <div
      className="flex h-20 w-full items-end justify-center gap-px overflow-hidden rounded-lg border border-silver/20 bg-black/30 px-2 pb-2 pt-3"
      aria-hidden
    >
      {heights.map((h, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-sm bg-accent/70",
            !reduceMotion && "motion-safe:origin-bottom motion-safe:animate-pulse"
          )}
          style={{
            height: reduceMotion ? Math.min(h, 44) : h,
            animationDelay: reduceMotion ? undefined : `${(i % 8) * 120}ms`,
          }}
        />
      ))}
    </div>
  );
}

function TimelineStrip({
  fragments,
  reduceMotion,
}: {
  fragments: TranscriptFragment[];
  reduceMotion: boolean;
}) {
  const weights = useMemo(() => fragmentWeights(fragments), [fragments]);
  if (fragments.length === 0) return null;
  return (
    <div className="mt-3 space-y-1">
      <p className="text-xs text-text-sub">タイムライン（モック・装飾）</p>
      <div className="flex h-10 w-full overflow-hidden rounded-md border border-silver/15 bg-silver/5">
        {fragments.map((f, i) => (
          <div
            key={f.id}
            title={f.text}
            className={cn(
              "flex min-w-0 items-center border-r border-silver/10 px-1.5 text-[10px] leading-tight text-text-sub last:border-r-0",
              !reduceMotion && "motion-safe:transition-colors motion-safe:duration-300",
              "hover:bg-accent/10"
            )}
            style={{ flex: `${weights[i] ?? 1} 1 0%` }}
          >
            <span className="line-clamp-2">{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DraggableSentenceChip({
  fragment,
  selected,
  onSelect,
  reduceMotion,
}: {
  fragment: TranscriptFragment;
  selected: boolean;
  onSelect: () => void;
  reduceMotion: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: fragment.id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 20 : undefined,
      }
    : undefined;

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "w-full rounded-lg border px-3 py-2 text-left text-sm leading-snug text-text-sub",
        "touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        selected
          ? "border-accent bg-accent/15"
          : "border-silver/30 bg-base-dark/90 hover:border-accent/40",
        isDragging && "opacity-60 shadow-lg ring-2 ring-accent/40",
        !reduceMotion && "motion-safe:transition-colors"
      )}
    >
      <span className="sr-only">ドラッグしてレーンへ移動。またはフォーカス後にレーンのボタンで割り当て。</span>
      {fragment.text}
    </button>
  );
}

function LaneDropZone({
  laneId,
  laneLabel,
  reportHeading,
  fragment,
  selectedFragmentId,
  onAssignSelected,
  onSelectFragment,
  reduceMotion,
}: {
  laneId: IncidentLaneId;
  laneLabel: string;
  reportHeading: string;
  fragment: TranscriptFragment | null;
  selectedFragmentId: string | null;
  onAssignSelected: () => void;
  onSelectFragment: (id: string) => void;
  reduceMotion: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `lane:${laneId}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg border border-dashed p-3",
        isOver ? "border-accent/60 bg-accent/10" : "border-silver/25 bg-silver/5"
      )}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-accent">{laneLabel}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-[10px] md:text-xs"
          disabled={!selectedFragmentId}
          onClick={onAssignSelected}
        >
          選択中をここへ
        </Button>
      </div>
      <p className="mb-2 font-mono text-[10px] text-text-sub/80">{reportHeading}</p>
      {fragment ? (
        <DraggableSentenceChip
          fragment={fragment}
          selected={selectedFragmentId === fragment.id}
          onSelect={() => onSelectFragment(fragment.id)}
          reduceMotion={reduceMotion}
        />
      ) : (
        <p className="py-4 text-center text-xs text-text-sub">未割り当て（ドロップ可）</p>
      )}
    </div>
  );
}

function PoolDropZone({
  children,
  reduceMotion,
}: {
  children: ReactNode;
  reduceMotion: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: POOL_ID });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[120px] rounded-lg border border-dashed p-3",
        isOver ? "border-emerald-500/50 bg-emerald-500/5" : "border-silver/30 bg-base-dark/50",
        !reduceMotion && "motion-safe:transition-colors"
      )}
    >
      <p className="mb-2 text-xs font-medium text-text-sub">未割当センテンス</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

const SAMPLES = [
  "積み忘れ1箱、荷主へ遅延連絡済み",
  "配送先不在、再配達依頼",
];

function subscribePrefersReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function prefersReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function prefersReducedMotionServerSnapshot() {
  return false;
}

export function DriverVoiceIncidentExperience({
  meta,
  className,
}: DriverVoiceIncidentExperienceProps) {
  const [text, setText] = useState("");
  const [fragments, setFragments] = useState<TranscriptFragment[]>([]);
  const [assignments, setAssignments] = useState<LaneAssignments>(() =>
    emptyAssignments()
  );
  const [selectedFragmentId, setSelectedFragmentId] = useState<string | null>(
    null
  );
  const reduceMotion = useSyncExternalStore(
    subscribePrefersReducedMotion,
    prefersReducedMotionSnapshot,
    prefersReducedMotionServerSnapshot
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const split = useCallback(() => {
    const next = splitTranscriptMock(text);
    setFragments(next);
    setAssignments(emptyAssignments());
    setSelectedFragmentId(next[0]?.id ?? null);
  }, [text]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const fragId = String(active.id);
    const overId = String(over.id);

    let next = clearFragmentFromLanes(assignments, fragId);

    if (overId === POOL_ID) {
      setAssignments(next);
      return;
    }

    if (overId.startsWith("lane:")) {
      const lane = overId.slice(5) as IncidentLaneId;
      if (!INCIDENT_LANES.some((l) => l.id === lane)) return;
      next = { ...next, [lane]: fragId };
      setAssignments(next);
    }
  };

  const assignSelectedToLane = (laneId: IncidentLaneId) => {
    if (!selectedFragmentId) return;
    let next = clearFragmentFromLanes(assignments, selectedFragmentId);
    next = { ...next, [laneId]: selectedFragmentId };
    setAssignments(next);
  };

  const byId = useMemo(
    () => new Map(fragments.map((f) => [f.id, f])),
    [fragments]
  );

  const draft = useMemo(
    () => buildIncidentDraft(fragments, assignments),
    [fragments, assignments]
  );

  const shipperMemo = useMemo(
    () => buildShipperMemo(assignments, fragments, text),
    [assignments, fragments, text]
  );

  const poolFragments = fragments.filter((f) => !laneForFragment(assignments, f.id));

  const barSeed = fragments.length * 11 + text.length;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-xl border border-silver/25 bg-base-dark/80 p-4 md:p-6">
        <h2 className="mb-3 text-sm font-semibold text-accent md:text-base">
          入力（音声の代わりにテキスト）
        </h2>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={meta.inputHint}
          rows={4}
          className="mb-3 resize-y text-sm md:text-base"
        />
        <div className="mb-3 flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setText(s)}
              className="rounded-full border border-silver/30 bg-silver/5 px-3 py-1 text-xs text-text-sub transition hover:border-accent/40 hover:text-text md:text-sm"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={split}>
            書き起こしに分割（モック）
          </Button>
        </div>
        <p className="mt-2 text-xs text-text-sub">
          本画面はプロトタイプです。チャットで実AIを試す場合は{" "}
          <Link
            href={`/demo/${meta.demoSlug}`}
            className="text-accent underline-offset-2 hover:underline"
          >
            ツールdemo
          </Link>
          へ。
        </p>
      </div>

      {fragments.length > 0 && (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="rounded-xl border border-silver/25 bg-base-dark/80 p-4 md:p-6">
            <h2 className="mb-3 text-sm font-semibold text-accent md:text-base">
              疑似音声波形・レーン振り分け
            </h2>
            <PseudoWaveform
              barCount={Math.min(64, 24 + fragments.length * 6)}
              seed={barSeed}
              reduceMotion={reduceMotion}
            />
            <TimelineStrip fragments={fragments} reduceMotion={reduceMotion} />

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <PoolDropZone reduceMotion={reduceMotion}>
                {poolFragments.length === 0 ? (
                  <p className="py-6 text-center text-xs text-text-sub">
                    すべてレーンに割り当て済み。戻す場合はチップをここへドラッグ。
                  </p>
                ) : (
                  poolFragments.map((f) => (
                    <DraggableSentenceChip
                      key={f.id}
                      fragment={f}
                      selected={selectedFragmentId === f.id}
                      onSelect={() => setSelectedFragmentId(f.id)}
                      reduceMotion={reduceMotion}
                    />
                  ))
                )}
              </PoolDropZone>

              <div className="space-y-2">
                <p className="text-xs text-text-sub">
                  レーンへドラッグするか、チップを選んで「選択中をここへ」で割り当て。
                </p>
                <div className="grid max-h-[min(60vh,520px)] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {INCIDENT_LANES.map(({ id, label, reportHeading }) => {
                    const fid = assignments[id];
                    const frag = fid ? (byId.get(fid) ?? null) : null;
                    return (
                      <LaneDropZone
                        key={id}
                        laneId={id}
                        laneLabel={label}
                        reportHeading={reportHeading}
                        fragment={frag}
                        selectedFragmentId={selectedFragmentId}
                        onAssignSelected={() => assignSelectedToLane(id)}
                        onSelectFragment={setSelectedFragmentId}
                        reduceMotion={reduceMotion}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </DndContext>
      )}

      {fragments.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-silver/20 bg-base-dark p-4">
            <h3 className="mb-3 text-sm font-semibold text-text md:text-base">
              インシデント報告（ドラフト）
            </h3>
            <ul className="space-y-4">
              {draft.sections.map((s) => (
                <li key={s.laneId}>
                  <p className="font-mono text-xs text-accent/90">{s.heading}</p>
                  {s.body ? (
                    <p className="mt-1 text-sm leading-relaxed text-text-sub">
                      {s.body}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-text-sub/70">
                      （未割り当て）
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-accent/25 bg-accent/5 p-4">
            <h3 className="mb-3 text-sm font-semibold text-text md:text-base">
              荷主連絡メモ
            </h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-sub">
              {shipperMemo}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
