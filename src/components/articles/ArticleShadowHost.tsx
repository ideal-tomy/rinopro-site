"use client";

import { useEffect, useRef } from "react";

type Props = {
  html: string;
};

/** 公開記事の本文幅・図幅・段階見出し。各記事CSSの上に載せる。 */
const RHYTHM_CSS = `
:host{
  display:block;
  width:100%;
  background:var(--paper, var(--bg, #fff));
  color:var(--ink, inherit);
  overflow-x:clip;
}
.wrap:not(.is-theme){
  max-width:940px !important;
  overflow:visible;
}
.col{
  max-width:620px !important;
}
.figure{
  width:min(900px, calc(100vw - 40px)) !important;
  max-width:min(900px, calc(100vw - 40px)) !important;
  margin:0 0 2.5em !important;
}
.figure + p{
  margin-bottom:2.2em;
}
.figure + p + .sec,
.figure + p + .phase,
.figure + p + h2{
  margin-top:1.2em;
}
.phase{
  margin-top:4.75em !important;
  margin-bottom:1.85em !important;
  padding-top:1.4em !important;
}
.phase h2{
  font-size:clamp(26px, 3.5vw, 34px) !important;
}
@media (max-width:640px){
  .figure{
    width:calc(100vw - 36px) !important;
    max-width:calc(100vw - 36px) !important;
  }
  .phase{
    margin-top:3.4em !important;
  }
  .phase h2{
    font-size:24px !important;
  }
}
`;

/**
 * innerHTML では <script> が動かない。Shadow 内の要素を document として渡して実行する。
 */
function runShadowScripts(shadow: ShadowRoot) {
  const scope = {
    getElementById: (id: string) => shadow.querySelector(`#${CSS.escape(id)}`),
    querySelector: (sel: string) => shadow.querySelector(sel),
    querySelectorAll: (sel: string) => shadow.querySelectorAll(sel),
    createElementNS: (ns: string, name: string) =>
      document.createElementNS(ns, name),
  };
  shadow.querySelectorAll("script").forEach((el) => {
    const code = el.textContent ?? "";
    el.remove();
    if (!code.trim()) return;
    try {
      const run = new Function("document", "window", code);
      run(scope, window);
    } catch (err) {
      console.warn("article script failed", err);
    }
  });
}

/**
 * 業界記事HTMLを Shadow DOM に隔離して描画する。
 */
export function ArticleShadowHost({ html }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let shadow = host.shadowRoot;
    if (!shadow) {
      shadow = host.attachShadow({ mode: "open" });
    }

    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const rawStyle = styleMatch?.[1] ?? "";
    const body = bodyMatch?.[1] ?? html;

    const style = rawStyle
      .replace(/:root\b/g, ":host")
      .replace(/\bhtml\s*,\s*body\b/g, ":host")
      .replace(/\bhtml\s*\{/g, ":host{")
      .replace(/\bbody\s*\{/g, ":host{");

    shadow.innerHTML = `<style>
:host{ display:block; }
${style}
${RHYTHM_CSS}
</style>${body}`;

    runShadowScripts(shadow);
  }, [html]);

  return <div ref={hostRef} className="article-shadow-host w-full" />;
}
