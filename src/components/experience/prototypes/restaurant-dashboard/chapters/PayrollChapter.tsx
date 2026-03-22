"use client";

import { MOCK_PAYROLL_ROWS } from "@/lib/experience/restaurant-dashboard/mock-data";

export function PayrollChapter() {
  const total = MOCK_PAYROLL_ROWS.reduce((s, r) => s + r.gross, 0);

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">給与試算</h2>
        <p className="text-xs text-slate-500">
          確定シフトから労働時間を集計（デモ・控除・社会保険は省略）。
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[280px] text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50 text-[10px] text-slate-500">
            <tr>
              <th className="px-2 py-2 font-medium">スタッフ</th>
              <th className="px-2 py-2 font-medium">時間</th>
              <th className="px-2 py-2 font-medium">時給</th>
              <th className="px-2 py-2 font-medium">支給（試算）</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PAYROLL_ROWS.map((row) => (
              <tr key={row.name} className="border-b border-slate-50">
                <td className="px-2 py-2 font-medium text-slate-900">
                  {row.name}
                </td>
                <td className="px-2 py-2 text-slate-700">{row.hours}h</td>
                <td className="px-2 py-2 text-slate-700">
                  ¥{row.hourly.toLocaleString("ja-JP")}
                </td>
                <td className="px-2 py-2 text-slate-900">
                  ¥{row.gross.toLocaleString("ja-JP")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-emerald-50/50 font-medium text-emerald-900">
              <td className="px-2 py-2" colSpan={3}>
                合計（試算）
              </td>
              <td className="px-2 py-2">
                ¥{total.toLocaleString("ja-JP")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-[10px] text-amber-800">
        ※ 本番の給与計算は労基・丸め・控除の確認が必要です。
      </p>
    </div>
  );
}
