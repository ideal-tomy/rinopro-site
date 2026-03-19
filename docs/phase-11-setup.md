# Phase 11 追加セットアップ

## Sentry（エラー監視）

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

- `sentry.client.config.ts`, `sentry.server.config.ts` が生成されます
- `SENTRY_DSN` を環境変数に設定

## Vercel Analytics

```bash
npm install @vercel/analytics
```

`app/layout.tsx` に追加:

```tsx
import { Analytics } from "@vercel/analytics/react";
// ...
<Analytics />
```

## hCaptcha / reCAPTCHA（問い合わせフォーム）

- hCaptcha: https://www.hcaptcha.com/
- reCAPTCHA: https://www.google.com/recaptcha/
- フォームにウィジェットを追加し、API送信前にトークン検証
