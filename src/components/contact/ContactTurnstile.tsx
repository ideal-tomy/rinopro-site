"use client";

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      appearance: "interaction-only";
      theme: "light";
      language: "ja";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    }
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onAxeonTurnstileLoad?: () => void;
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onAxeonTurnstileLoad&render=explicit";

export type ContactTurnstileHandle = {
  reset: () => void;
};

/**
 * 通常の送信では欄を出さない。Cloudflare が追加確認を求めたときだけ表示する。
 * 確認そのものは毎回行い、結果のトークンを送信に載せる。
 */
export function ContactTurnstile({
  ref,
  onToken,
}: {
  ref?: Ref<ContactTurnstileHandle>;
  onToken: (token: string | null) => void;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  useImperativeHandle(ref, () => ({
    reset: () => {
      onToken(null);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!siteKey || !container) return;

    const observer = new ResizeObserver(() => {
      setVisible(container.offsetHeight > 8);
    });
    observer.observe(container);

    let cancelled = false;
    const renderWidget = () => {
      if (cancelled || widgetIdRef.current || !containerRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        appearance: "interaction-only",
        theme: "light",
        language: "ja",
        callback: (token) => {
          setFailed(false);
          onToken(token);
        },
        "expired-callback": () => onToken(null),
        "error-callback": () => {
          onToken(null);
          setFailed(true);
        },
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      window.onAxeonTurnstileLoad = () => {
        if (!cancelled) renderWidget();
      };
      if (!document.getElementById(SCRIPT_ID)) {
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      observer.disconnect();
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onToken, siteKey]);

  if (!siteKey) return null;

  return (
    <div>
      <div ref={containerRef} className={visible ? "min-h-11" : undefined} />
      {failed ? (
        <p className="text-sm text-red-500" role="alert">
          確認を開始できませんでした。ページを再読み込みしてください。
        </p>
      ) : null}
    </div>
  );
}
