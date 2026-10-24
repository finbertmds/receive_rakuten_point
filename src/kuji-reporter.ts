import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

type KujiResult = { source: string; page: string; result: string; error?: string };

export default class KujiReporter implements Reporter {
  private results: KujiResult[] = [];

  onTestEnd(_test: TestCase, result: TestResult) {
    for (const attachment of result.attachments) {
      if (attachment.name === 'kuji-result' && attachment.body) {
        this.results.push(JSON.parse(attachment.body.toString()) as KujiResult);
      }
    }
  }

  onEnd() {
    if (!this.results.length) return;
    const failed = this.results.filter(item =>
      item.result !== 'entry-completed' && item.result !== 'already-played-or-ended');
    console.log(`\n[Kuji summary] ${this.results.length} pages processed; ${failed.length} results need attention.`);
    for (const item of failed) console.log(`[Kuji failed] ${JSON.stringify(item)}`);
  }
}
