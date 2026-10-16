import type { ReactNode } from "react";
import { AxProductScreen } from "@/components/ui/ax/patterns";
import { AxProse } from "@/components/ui/ax/patterns";

const kaigoDisplay = "font-[family-name:var(--font-kaigo-display)]";

function RoleNote({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 flex items-start gap-2 text-[13px] leading-[1.65] text-[var(--ax-theme-demo-note,#8faca3)]">
      <span aria-hidden className="mt-0.5 shrink-0">
        ⓘ
      </span>
      <span>{children}</span>
    </p>
  );
}

function StatusChip({
  tone,
  label,
}: {
  tone: "done" | "wait" | "alert";
  label: string;
}) {
  const toneClass =
    tone === "done"
      ? "bg-[color-mix(in_srgb,var(--ax-theme-ok,#3b8c6c)_18%,#fff)] text-[var(--ax-theme-ok,#3b8c6c)]"
      : tone === "wait"
        ? "bg-[color-mix(in_srgb,var(--ax-theme-accent,#de8e33)_18%,#fff)] text-[var(--ax-theme-accent,#de8e33)]"
        : "bg-[color-mix(in_srgb,var(--ax-theme-alert,#be5239)_18%,#fff)] text-[var(--ax-theme-alert,#be5239)]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${toneClass}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === "done"
            ? "bg-[var(--ax-theme-ok,#3b8c6c)]"
            : tone === "wait"
              ? "bg-[var(--ax-theme-accent,#de8e33)]"
              : "bg-[var(--ax-theme-alert,#be5239)]"
        }`}
        aria-hidden
      />
      {label}
    </span>
  );
}

export function KaigoFieldView() {
  return (
    <div className="space-y-4">
      <RoleNote>
        現場スタッフは自分の担当拠点・利用者のみにアクセス。スマホ前提・大きなボタンで「入力するだけ」。
      </RoleNote>
      <div className="grid gap-6 lg:grid-cols-[minmax(260px,300px)_1fr] lg:items-start">
        <div className="mx-auto w-full max-w-[300px] rounded-[2rem] border-[10px] border-[#1c2522] bg-[#1c2522] p-2 shadow-2xl">
          <div className="overflow-hidden rounded-[1.25rem] bg-white">
            <div className="bg-[var(--ax-brand-primary)] px-4 py-3 text-white">
              <p className="text-[12px] opacity-90">おつかれさまです</p>
              <p className="text-[14px] font-bold">佐藤さん｜さくらホーム</p>
            </div>
            <div className="space-y-3 p-3">
              <p className="text-[11px] font-bold text-[var(--ax-text-supporting)]">
                本日の訪問・対応（3件）
              </p>
              {[
                ["10:00", "田中 様", "服薬確認・バイタル"],
                ["13:30", "鈴木 様", "生活支援・通院同行"],
                ["16:00", "山本 様", "夕食支援"],
              ].map(([time, name, task]) => (
                <div
                  key={time}
                  className="flex gap-2 rounded-lg bg-[var(--ax-surface-muted)] px-2 py-2 text-[12px]"
                >
                  <span className="font-mono font-bold text-[var(--ax-brand-primary)]">
                    {time}
                  </span>
                  <div>
                    <p className="font-bold text-[var(--ax-text-heading)]">{name}</p>
                    <p className="text-[var(--ax-text-supporting)]">{task}</p>
                  </div>
                </div>
              ))}
              <p className="rounded-xl bg-[var(--ax-theme-accent,#de8e33)] py-3 text-center text-[14px] font-bold text-white">
                ＋ 今すぐ報告する
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-[var(--ax-text-heading)]">
                {["バイタル入力", "服薬チェック", "特記・ヒヤリ", "過去の報告"].map(
                  (label) => (
                    <span
                      key={label}
                      className="rounded-lg border border-[var(--ax-border-subtle)] px-2 py-2 text-center"
                    >
                      {label}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        <AxProse
          fullWidth
          className="!max-w-none [&>p]:!text-[var(--ax-theme-demo-fg,#eaf0ed)] [&>ul]:!text-[var(--ax-theme-demo-fg,#eaf0ed)]"
        >
          <h3
            className={`${kaigoDisplay} text-[clamp(1.4375rem,2.6vw,2rem)] font-extrabold leading-snug !text-white`}
          >
            現場の負担を、極限まで減らす。
          </h3>
          <p>
            世話人・生活支援員など、IT操作に不慣れな方でも迷わないことを最優先に設計します。手入力を減らし、選択とワンタップで報告を完結。届いた報告は、内勤側で自動的に整理され、報告書のかたちになります。
          </p>
          <ul className="mt-4 space-y-2 text-[14px] md:text-[16px]">
            {[
              "使い慣れたLINE Worksからもそのまま報告できる導線",
              "バイタル・服薬は数値/チェック式で転記ミスを防止",
              "見えるのは自分の担当範囲のみ（他拠点は非表示）",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--ax-theme-accent,#de8e33)]">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </AxProse>
      </div>
    </div>
  );
}

export function KaigoOfficeView() {
  const sites: Array<{
    code: string;
    name: string;
    staff: string;
    meta: string;
    tone: "done" | "wait" | "alert";
    status: string;
  }> = [
    {
      code: "GH-03",
      name: "さくらホーム",
      staff: "佐藤",
      meta: "10:42 報告",
      tone: "done",
      status: "報告済",
    },
    {
      code: "GH-07",
      name: "あおぞらの家",
      staff: "高橋",
      meta: "未報告",
      tone: "wait",
      status: "未報告",
    },
    {
      code: "GH-11",
      name: "ひだまり荘",
      staff: "伊藤",
      meta: "09:15 バイタル異常",
      tone: "alert",
      status: "要対応",
    },
    {
      code: "VN-01",
      name: "精神科訪問看護",
      staff: "渡辺Ns",
      meta: "11:30 報告",
      tone: "done",
      status: "報告済",
    },
  ];

  const queue = [
    {
      title: "田中 様｜バイタル・服薬の報告から看護記録書IIのドラフトを生成しました",
      src: "SRC: LINE Works ＞ 自動構造化 ＞ 報告書ドラフト",
    },
    {
      title: "ひだまり荘｜血圧上昇を検知。ヒヤリハット報告と医療連携の起票を提案",
      src: "SRC: バイタル異常 ＞ アラート ＞ 連携起票",
    },
  ];

  return (
    <div className="space-y-4">
      <RoleNote>
        内勤・管理者は全拠点を俯瞰。「未報告」「要対応」だけが自動で前に出る、確認もれゼロのダッシュボード。
      </RoleNote>
      <AxProductScreen urlLabel="app.axeon-care.jp / dashboard" badge="管理者ビュー">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["本日の報告", "18/20", "ok"],
            ["未確認", "2", "warn"],
            ["要対応アラート", "1", "alert"],
            ["今月 自動生成した報告書", "142", ""],
          ].map(([lab, num, tone]) => (
            <div
              key={lab}
              className="rounded-xl border border-[var(--ax-border-subtle)] p-3"
            >
              <p className="text-[11px] text-[var(--ax-text-supporting)]">{lab}</p>
              <p
                className={`mt-1 font-mono text-[22px] font-bold ${
                  tone === "warn"
                    ? "text-[var(--ax-theme-accent,#de8e33)]"
                    : tone === "alert"
                      ? "text-[var(--ax-theme-alert,#be5239)]"
                      : tone === "ok"
                        ? "text-[var(--ax-theme-ok,#3b8c6c)]"
                        : "text-[var(--ax-text-heading)]"
                }`}
              >
                {num}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-[var(--ax-border-subtle)] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[13px] font-bold text-[var(--ax-text-heading)]">
              拠点ステータス（20GH＋訪問看護）
            </p>
            <span className="text-[11px] font-semibold text-[var(--ax-text-supporting)]">
              リアルタイム更新
            </span>
          </div>
          <ul className="mt-2 space-y-2 text-[12px]">
            {sites.map((s) => (
              <li
                key={s.code}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[var(--ax-surface-muted)] px-3 py-2"
              >
                <span className="flex min-w-0 flex-wrap items-center gap-2 text-[var(--ax-text-heading)]">
                  <span className="rounded bg-[var(--ax-surface-card)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--ax-brand-primary)]">
                    {s.code}
                  </span>
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-[var(--ax-text-supporting)]">{s.staff}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[var(--ax-text-supporting)]">{s.meta}</span>
                  <StatusChip tone={s.tone} label={s.status} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 rounded-xl border border-[var(--ax-border-subtle)] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[13px] font-bold text-[var(--ax-text-heading)]">
              確認・承認キュー｜現場報告 → 報告書ドラフト
            </p>
            <span className="text-[11px] font-semibold text-[var(--ax-theme-accent,#de8e33)]">
              2件 待ち
            </span>
          </div>
          <ul className="mt-2 space-y-2">
            {queue.map((q) => (
              <li
                key={q.title}
                className="flex flex-col gap-2 rounded-lg bg-[var(--ax-surface-muted)] px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-[12.5px] leading-[1.55] text-[var(--ax-text-heading)]">
                    {q.title}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--ax-text-supporting)]">
                    {q.src}
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-[var(--ax-brand-primary)] px-3 py-2 text-center text-[12px] font-bold text-white">
                  内容を確認
                </span>
              </li>
            ))}
          </ul>
        </div>
      </AxProductScreen>
    </div>
  );
}

export function KaigoMedicalView() {
  return (
    <div className="space-y-4">
      <RoleNote>
        外部の医師・委託看護師は社内システムに直接入らず、共有された予定と「許可された利用者の許可された情報」だけを閲覧する限定ポータル。
      </RoleNote>
      <AxProductScreen
        urlLabel="share.axeon-care.jp / 外部連携ポータル"
        badge="外部・限定ビュー"
      >
        <p className="rounded-lg border border-[var(--ax-border-subtle)] bg-[color-mix(in_srgb,var(--ax-theme-accent,#de8e33)_12%,#fff)] p-3 text-[12.5px] leading-[1.6] text-[var(--ax-text-heading)]">
          <strong>共有範囲は利用者・項目単位で制御されています。</strong>{" "}
          連携先の医療機関には、対象の利用者の医療上必要な情報のみを表示。閲覧操作はすべて監査ログに記録されます。
        </p>

        <div className="mt-3 rounded-xl border border-[var(--ax-border-subtle)] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[13px] font-bold text-[var(--ax-text-heading)]">
              看護師 × 医師 共有スケジュール
            </p>
            <span className="text-[11px] font-semibold text-[var(--ax-text-supporting)]">
              今週
            </span>
          </div>
          <div className="mt-2 overflow-x-auto">
            <div className="min-w-[520px] rounded-lg border border-[var(--ax-border-subtle)] text-[11px]">
              <div className="grid grid-cols-6 bg-[var(--ax-surface-muted)] font-bold text-[var(--ax-text-heading)]">
                <div className="p-2" />
                {["月", "火", "水", "木", "金"].map((d) => (
                  <div
                    key={d}
                    className="border-l border-[var(--ax-border-subtle)] p-2 text-center"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-6 border-t border-[var(--ax-border-subtle)]">
                <div className="p-2 font-bold text-[var(--ax-text-heading)]">AM</div>
                <div className="border-l border-[var(--ax-border-subtle)] p-1">
                  <span className="block rounded bg-[#dbe9e3] px-1 py-0.5 text-[var(--ax-text-heading)]">
                    訪問看護 田中様
                    <span className="mt-0.5 block text-[10px] text-[var(--ax-text-supporting)]">
                      渡辺Ns
                    </span>
                  </span>
                </div>
                <div className="border-l border-[var(--ax-border-subtle)]" />
                <div className="border-l border-[var(--ax-border-subtle)] p-1">
                  <span className="block rounded bg-[#faead2] px-1 py-0.5 text-[var(--ax-text-heading)]">
                    訪問診療 山本様
                    <span className="mt-0.5 block text-[10px] text-[var(--ax-text-supporting)]">
                      中村Dr
                    </span>
                  </span>
                </div>
                <div className="border-l border-[var(--ax-border-subtle)] p-1">
                  <span className="block rounded bg-[#dbe9e3] px-1 py-0.5 text-[var(--ax-text-heading)]">
                    訪問看護 鈴木様
                    <span className="mt-0.5 block text-[10px] text-[var(--ax-text-supporting)]">
                      渡辺Ns
                    </span>
                  </span>
                </div>
                <div className="border-l border-[var(--ax-border-subtle)]" />
              </div>
              <div className="grid grid-cols-6 border-t border-[var(--ax-border-subtle)]">
                <div className="p-2 font-bold text-[var(--ax-text-heading)]">PM</div>
                <div className="border-l border-[var(--ax-border-subtle)]" />
                <div className="border-l border-[var(--ax-border-subtle)] p-1">
                  <span className="block rounded bg-[color-mix(in_srgb,var(--ax-brand-primary)_14%,#fff)] px-1 py-0.5 text-[var(--ax-text-heading)]">
                    合同カンファ
                    <span className="mt-0.5 block text-[10px] text-[var(--ax-text-supporting)]">
                      Dr＋Ns＋管理者
                    </span>
                  </span>
                </div>
                <div className="border-l border-[var(--ax-border-subtle)]" />
                <div className="border-l border-[var(--ax-border-subtle)]" />
                <div className="border-l border-[var(--ax-border-subtle)] p-1">
                  <span className="block rounded bg-[#faead2] px-1 py-0.5 text-[var(--ax-text-heading)]">
                    訪問診療 田中様
                    <span className="mt-0.5 block text-[10px] text-[var(--ax-text-supporting)]">
                      中村Dr
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-[var(--ax-border-subtle)] p-3">
          <p className="text-[13px] font-bold text-[var(--ax-text-heading)]">
            共有された記録・指示書（許可範囲のみ）
          </p>
          <ul className="mt-2 space-y-2 text-[12px]">
            {[
              {
                title: "田中 様｜訪問看護指示書",
                meta: "有効期限 残14日",
                tone: "done" as const,
                status: "有効",
              },
              {
                title: "山本 様｜バイタル推移（直近7日）",
                meta: "共有許可済",
                tone: "done" as const,
                status: "閲覧可",
              },
              {
                title: "鈴木 様｜支援計画 全体",
                meta: "共有対象外",
                tone: "alert" as const,
                status: "非表示",
              },
            ].map((row) => (
              <li
                key={row.title}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[var(--ax-surface-muted)] px-3 py-2"
              >
                <span className="font-semibold text-[var(--ax-text-heading)]">
                  {row.title}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[var(--ax-text-supporting)]">{row.meta}</span>
                  <StatusChip tone={row.tone} label={row.status} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </AxProductScreen>
    </div>
  );
}
