/** 曜日別入客（件数） */
export const WEEKDAY_TRAFFIC = [
  { day: "月", count: 82 },
  { day: "火", count: 71 },
  { day: "水", count: 68 },
  { day: "木", count: 75 },
  { day: "金", count: 118 },
  { day: "土", count: 142 },
  { day: "日", count: 135 },
] as const;

export const MAX_TRAFFIC = Math.max(...WEEKDAY_TRAFFIC.map((d) => d.count));

export const MOCK_SHIFTS_PENDING = [
  { name: "田中", role: "ホール", date: "3/24（月）", slot: "11:00–15:00" },
  { name: "佐藤", role: "キッチン", date: "3/24（月）", slot: "17:00–22:00" },
  { name: "鈴木", role: "ホール", date: "3/25（火）", slot: "11:00–15:00" },
] as const;

export const MOCK_RECEIPTS = [
  {
    id: "r1",
    vendor: "○○商事（食材）",
    amount: 12480,
    date: "2026/03/20",
    taxCategory: "経費（仕入）",
    filingTag: "青色申告 必要経費",
  },
  {
    id: "r2",
    vendor: "△△電気",
    amount: 8900,
    date: "2026/03/18",
    taxCategory: "光熱費",
    filingTag: "事業所用 按分要確認",
  },
] as const;

export const MOCK_PAYROLL_ROWS = [
  { name: "田中", hours: 32, hourly: 1200, gross: 38400 },
  { name: "佐藤", hours: 28, hourly: 1300, gross: 36400 },
  { name: "鈴木", hours: 18, hourly: 1150, gross: 20700 },
] as const;

export const MOCK_EXPENSES_UNPAID = [
  { id: "u1", title: "3月食材（未払）", amount: 45200, due: "3/31" },
  { id: "u2", title: "消耗品注文", amount: 6800, due: "4/5" },
] as const;

export const MOCK_EXPENSES_SETTLED = [
  { id: "s1", title: "2月光熱費", amount: 12400, paidOn: "3/10" },
  { id: "s2", title: "衛生用品", amount: 9200, paidOn: "3/15" },
] as const;
