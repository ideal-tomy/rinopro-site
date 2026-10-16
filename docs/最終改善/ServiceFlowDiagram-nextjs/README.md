# 支援工程図（Next.js）

ServiceFlowDiagram.tsx を components/ServiceFlowDiagram.tsx へコピーし、任意のページで使用します。

```tsx
import ServiceFlowDiagram from "@/components/ServiceFlowDiagram";

export default function Page() {
  return <ServiceFlowDiagram />;
}
```

外部ライブラリ・画像・use client は不要です。preview.html は同じ座標・色・文字による単独ブラウザ確認用です。画面幅が900px未満の場合は横スクロールします。元画像に合わせ、本文は「内容」のまま、最初の2工程だけ強調しています。文字の外観は利用環境の日本語フォントにより多少変わります。
