// Investigation only: isolated fixture, intercepted POST, no email sent.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.resolve(__dirname, '../../../ideal_official/node_modules/playwright'));
const origin = process.env.SITE_ORIGIN || 'http://127.0.0.1:3190';
const snapshot = {
  schemaVersion: 1, source: 'estimate_detailed', createdAt: '2026-10-23T12:00:00.000Z',
  answers: { 業種: '建設', 課題: '調査用サンプル・報告業務を効率化したい' },
  ai: {
    requirementTitle: '調査用の報告システム', requirementDefinitionDocument: '## 調査用要件\n写真と日報を管理する。',
    scopeIn: ['報告作成'], scopeOut: [], openQuestions: [], regulatoryNotes: [], assumptions: ['社内用'],
    followUpItems: [], estimateDrivers: [], plainCustomerSummary: '調査用サンプル。報告業務を効率化するシステム。', estimateLoMan: 80, estimateHiMan: 120,
  },
  requirementDocMarkdown: '# 調査用の報告システム\n\n写真と日報を管理する。',
};
const flow = {
  v: 1, ctxQuery: null, priorContext: '', answers: snapshot.answers, ai: snapshot.ai,
  visitorJourney: null, inquiryPreparation: null,
};

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  try {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    await context.addInitScript(({ flow, snapshot }) => {
      sessionStorage.setItem('AXEON_estimate_detailed_flow_v1', JSON.stringify(flow));
      sessionStorage.setItem('AXEON_contact_estimate_snapshot_v1', JSON.stringify(snapshot));
      sessionStorage.setItem('AXEON_contact_prefill_v1', '【調査用の見積引き継ぎ】80〜120万円。要件は写真・日報管理。');
    }, { flow, snapshot });
    const page = await context.newPage();
    await page.goto(origin + '/estimate-detailed/amount', { waitUntil: 'networkidle' });
    const link = page.getByRole('link', { name: 'お問い合わせページへ', exact: true });
    const entryHref = await link.getAttribute('href');
    assert.equal(entryHref, '/contact');
    await link.click();
    await page.waitForURL(url => url.pathname === '/contact');
    await page.waitForLoadState('networkidle');
    const emptyMessage = await page.locator('#contact-message').inputValue();
    assert.equal(emptyMessage, '');
    let sent;
    await page.route('**/api/contact', async route => {
      sent = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true,"mode":"intercepted_audit"}' });
    });
    await page.locator('#contact-name').fill('調査用テスト');
    await page.locator('#contact-email').fill('audit@example.com');
    await page.locator('#contact-message').fill('調査用の追記です。実際には送信しません。');
    await page.locator('form button[type="submit"]').click();
    assert.ok(sent);
    assert.equal(Object.hasOwn(sent, 'estimateSnapshot'), false);
    assert.equal(Object.hasOwn(sent, 'inquiryBrief'), false);
    results.push({ case: 'amount-to-contact', entryHref, messageAfterNavigation: emptyMessage, interceptedPayloadKeys: Object.keys(sent), sentEstimateSnapshot: false, actualEmailSent: false });

    await page.goto(origin + '/contact?from=estimate&prefill=session', { waitUntil: 'networkidle' });
    const forcedMessage = await page.locator('#contact-message').inputValue();
    assert.equal(forcedMessage, '');
    results.push({ case: 'explicit-estimate-marker-with-valid-storage', message: forcedMessage, outcome: 'Valid estimate flow, snapshot and prefill are ignored by ContactForm' });

    await page.goto(origin + '/contact?prefill=' + encodeURIComponent('コンシェルジュからの調査用引き継ぎです。'), { waitUntil: 'networkidle' });
    const conciergeMessage = await page.locator('#contact-message').inputValue();
    assert.equal(conciergeMessage, '');
    results.push({ case: 'concierge-prefill-url', message: conciergeMessage, outcome: 'URL prefill is also ignored' });
    fs.writeFileSync(path.join(__dirname, 'results.json'), JSON.stringify({ origin, results }, null, 2) + '\n');
    console.log('CONFIRMED: amount CTA drops handoff; ContactForm ignores valid handoff/prefill; intercepted POST omits estimateSnapshot. No email sent.');
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
