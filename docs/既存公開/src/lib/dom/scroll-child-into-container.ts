/**
 * 縦スクロールコンテナ内で、子の上端がコンテナ上端付近に来るよう scrollTop を調整する。
 * iOS でフォーカス後に見出しが上に消える場合の補助。
 */
export function scrollChildTopIntoScrollContainer(
  container: HTMLElement,
  child: HTMLElement,
  paddingTop = 12
): void {
  const cRect = container.getBoundingClientRect();
  const chRect = child.getBoundingClientRect();
  const delta = chRect.top - cRect.top - paddingTop;
  if (delta < 0) {
    container.scrollTop += delta;
  }
}
