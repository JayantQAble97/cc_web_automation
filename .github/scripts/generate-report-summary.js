const fs = require('fs');
const path = require('path');

const reportPath = process.argv[2] || 'reports/test-results.json';
const outputPath = process.argv[3] || 'reports/email-summary.txt';

const defaults = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  flaky: 0,
  durationMs: 0,
  failures: [],
};

function collectTests(suite, failures = []) {
  let stats = { ...defaults, failures };

  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      stats.total += 1;
      const result = test.results?.[test.results.length - 1];
      stats.durationMs += result?.duration || 0;
      const testStatus = test.status;

      if (testStatus === 'skipped') stats.skipped += 1;
      else if (testStatus === 'flaky') stats.flaky += 1;
      else if (testStatus === 'unexpected') {
        stats.failed += 1;
        const message = result?.error?.message || result?.errors?.[0]?.message || 'No error message';
        stats.failures.push(`${spec.title} › ${test.title}: ${message.split('\n')[0]}`);
      } else stats.passed += 1;
    }
  }

  for (const child of suite.suites || []) {
    const childStats = collectTests(child, stats.failures);
    stats.total += childStats.total;
    stats.passed += childStats.passed;
    stats.failed += childStats.failed;
    stats.skipped += childStats.skipped;
    stats.flaky += childStats.flaky;
    stats.durationMs += childStats.durationMs;
  }

  return stats;
}

function formatDuration(ms) {
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}

let stats = { ...defaults };

try {
  if (fs.existsSync(reportPath)) {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    for (const suite of report.suites || []) {
      const suiteStats = collectTests(suite);
      stats.total += suiteStats.total;
      stats.passed += suiteStats.passed;
      stats.failed += suiteStats.failed;
      stats.skipped += suiteStats.skipped;
      stats.flaky += suiteStats.flaky;
      stats.durationMs += suiteStats.durationMs;
      stats.failures.push(...suiteStats.failures);
    }
  } else {
    stats.failures.push(`Report file not found: ${reportPath}`);
  }
} catch (error) {
  stats.failures.push(`Failed to parse report: ${error.message}`);
}

const failureHighlights =
  stats.failures.length > 0
    ? stats.failures.slice(0, 10).map((item, index) => `${index + 1}. ${item}`).join('\n')
    : 'No failures.';

const summary = [
  'Playwright Test Run Summary',
  '===========================',
  `Total: ${stats.total}`,
  `Passed: ${stats.passed}`,
  `Failed: ${stats.failed}`,
  `Skipped: ${stats.skipped}`,
  `Flaky: ${stats.flaky}`,
  `Duration: ${formatDuration(stats.durationMs)}`,
  '',
  'Failure Highlights',
  '------------------',
  failureHighlights,
].join('\n');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, summary);

const status = stats.failed > 0 ? 'FAILED' : 'PASSED';
const statsEnvPath = path.join(path.dirname(outputPath), 'stats.env');
const statsEnv = [
  `TOTAL=${stats.total}`,
  `PASSED=${stats.passed}`,
  `FAILED=${stats.failed}`,
  `SKIPPED=${stats.skipped}`,
  `FLAKY=${stats.flaky}`,
  `DURATION=${formatDuration(stats.durationMs)}`,
  `STATUS=${status}`,
  '',
].join('\n');
fs.writeFileSync(statsEnvPath, statsEnv);

console.log(summary);
