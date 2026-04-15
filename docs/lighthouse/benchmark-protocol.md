# Lighthouse Benchmark Protocol

## Goal
- Keep Lighthouse runs reproducible by removing extension noise and using identical run conditions.

## Fixed Conditions
- Run Chrome in incognito mode.
- Disable all extensions while benchmarking.
- Use production build (`next build` + `next start`) or the deployed production URL.
- Measure each target page 3 times and compare medians.
- Keep the same Lighthouse preset and throttling settings for every run.

## Pages
- `/`
- `/demo`
- `/services`

## Command Example
- `npx lighthouse "https://rinopro-site.vercel.app/" --output=json --output-path="docs/lighthouse/latest-home-1.json" --chrome-flags="--headless=new --incognito --disable-extensions"`

## Compare Metrics
- Performance score
- Largest Contentful Paint (LCP)
- Total Blocking Time (TBT)
- Minimize main-thread work
- Reduce JavaScript execution time
