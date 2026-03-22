/**
 * aiDemo モックのバッチ結合口
 * 新バッチを追加したら import して nextMockDemos の配列に spread する。
 */
import { batch01NextMockDemos } from "./batch-01-next-mock";
import { batch02NextMockDemos } from "./batch-02-next-mock";
import { batch03NextMockDemos } from "./batch-03-next-mock";
import { batch04NextMockDemos } from "./batch-04-next-mock";
import { batch05NextMockDemos } from "./batch-05-next-mock";
import { batch06NextMockDemos } from "./batch-06-next-mock";
import { batch07NextMockDemos } from "./batch-07-next-mock";
import { batch08NextMockDemos } from "./batch-08-next-mock";

export const nextMockDemos = [
  ...batch01NextMockDemos,
  ...batch02NextMockDemos,
  ...batch03NextMockDemos,
  ...batch04NextMockDemos,
  ...batch05NextMockDemos,
  ...batch06NextMockDemos,
  ...batch07NextMockDemos,
  ...batch08NextMockDemos,
];
