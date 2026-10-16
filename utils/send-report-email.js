const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const SMTP_USER = 'ankitpatel@qable.io';
const SMTP_PASS = 'zjwtgkflbwczqrpb';

const TO = [
  'dharm.vrat@customer-capital.com',
  'urvashi.saraswat@customer-capital.com',
  'nikunj.trivedi@qable.io',
  'aneri.patel@qable.io',
  '1ee687f3.linearloop.io@in.teams.ms',
];

const reportPath = path.resolve(__dirname, '../reports/test-results.json');
const summaryPath = path.resolve(__dirname, '../reports/email-summary.txt');

function collectTests(suite, failures = []) {
  let stats = { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0, durationMs: 0, failures };
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      stats.total++;
      const result = test.results?.[test.results.length - 1];
      stats.durationMs += result?.duration || 0;
      const testStatus = test.status;
      if (testStatus === 'skipped') stats.skipped++;
      else if (testStatus === 'flaky') stats.flaky++;
      else if (testStatus === 'unexpected') {
        stats.failed++;
        const msg = result?.error?.message || 'No error message';
        stats.failures.push(`${spec.title} — ${test.title}: ${msg.split('\n')[0]}`);
      } else stats.passed++;
    }
  }
  for (const child of suite.suites || []) {
    const c = collectTests(child, stats.failures);
    stats.total += c.total; stats.passed += c.passed; stats.failed += c.failed;
    stats.skipped += c.skipped; stats.flaky += c.flaky; stats.durationMs += c.durationMs;
  }
  return stats;
}

function formatDuration(ms) {
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}

let stats = { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0, durationMs: 0, failures: [] };
const project = process.env.PROJECT || 'Local';
const client = process.env.CLIENT || '';
const reportUrl = process.env.REPORT_URL || '';
const buildUrl = process.env.BUILD_URL || '';
const branch = process.env.GIT_BRANCH || process.env.GIT_LOCAL_BRANCH || '';
const commit = (process.env.GIT_COMMIT || '').substring(0, 7);

try {
  if (fs.existsSync(reportPath)) {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    for (const suite of report.suites || []) {
      const s = collectTests(suite);
      stats.total += s.total; stats.passed += s.passed; stats.failed += s.failed;
      stats.skipped += s.skipped; stats.flaky += s.flaky; stats.durationMs += s.durationMs;
      stats.failures.push(...s.failures);
    }
  }
} catch (e) {
  stats.failures.push(`Failed to parse report: ${e.message}`);
}

const status = stats.failed > 0 ? 'FAILED' : 'PASSED';
const statusColor = stats.failed > 0 ? '#cc0000' : '#00b300';
const failureRows = stats.failures.length
  ? stats.failures.slice(0, 10).map((f, i) => `<tr><td style="padding:6px;color:#cc0000">${i + 1}. ${f}</td></tr>`).join('')
  : '<tr><td style="padding:6px;color:#00b300">No failures</td></tr>';

const linksRow = (reportUrl || buildUrl)
  ? `<p style="margin-top:16px">
      ${reportUrl ? `<a href="${reportUrl}" style="background:#0066cc;color:#fff;padding:10px 18px;border-radius:4px;text-decoration:none;font-weight:bold">📊 View Playwright Report</a>` : ''}
      ${reportUrl && buildUrl ? '&nbsp;' : ''}
      ${buildUrl ? `<a href="${buildUrl}" style="background:#555;color:#fff;padding:10px 18px;border-radius:4px;text-decoration:none;font-weight:bold">🔗 View Build</a>` : ''}
    </p>`
  : '';

const htmlBody = `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:20px">
  <h2 style="background:${statusColor};color:#fff;padding:12px 16px;border-radius:4px;margin:0 0 20px">
    🎭 Playwright Report — ${status}
  </h2>
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px">
    <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;width:140px">Project</td><td style="padding:8px">${project}</td></tr>
    ${client ? `<tr><td style="padding:8px;font-weight:bold">Client</td><td style="padding:8px">${client}</td></tr>` : ''}
    <tr><td style="padding:8px;${client ? 'background:#f5f5f5;' : ''}font-weight:bold">Total Tests</td><td style="padding:8px">${stats.total}</td></tr>
    <tr><td style="padding:8px;${client ? '' : 'background:#f5f5f5;'}font-weight:bold">Passed</td><td style="padding:8px;color:#00b300"><strong>${stats.passed}</strong></td></tr>
    <tr><td style="padding:8px;${client ? 'background:#f5f5f5;' : ''}font-weight:bold">Failed</td><td style="padding:8px;color:#cc0000"><strong>${stats.failed}</strong></td></tr>
    <tr><td style="padding:8px;${client ? '' : 'background:#f5f5f5;'}font-weight:bold">Skipped</td><td style="padding:8px">${stats.skipped}</td></tr>
    <tr><td style="padding:8px;${client ? 'background:#f5f5f5;' : ''}font-weight:bold">Flaky</td><td style="padding:8px">${stats.flaky}</td></tr>
    <tr><td style="padding:8px;${client ? '' : 'background:#f5f5f5;'}font-weight:bold">Duration</td><td style="padding:8px">${formatDuration(stats.durationMs)}</td></tr>
    ${branch ? `<tr><td style="padding:8px;background:#f5f5f5;font-weight:bold">Branch</td><td style="padding:8px">${branch}</td></tr>` : ''}
    ${commit ? `<tr><td style="padding:8px;font-weight:bold">Commit</td><td style="padding:8px">${commit}</td></tr>` : ''}
  </table>
  <h3 style="border-bottom:2px solid #eee;padding-bottom:8px">Failure Highlights</h3>
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
    ${failureRows}
  </table>
  ${linksRow}
</body>
</html>`;

const subject = `[${status}] Playwright — ${client ? client + ' ' : ''}${project} — ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;

async function sendEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { ciphers: 'SSLv3' },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
  } catch (err) {
    console.error('❌ SMTP verify failed:', err.message);
    process.exit(1);
  }

  const info = await transporter.sendMail({
    from: `"Playwright CI" <${SMTP_USER}>`,
    to: TO.join(', '),
    subject,
    html: htmlBody,
    text: fs.existsSync(summaryPath) ? fs.readFileSync(summaryPath, 'utf8') : subject,
  });

  console.log(`✅ Email sent → ${info.messageId}`);
  console.log(`   To: ${TO.join(', ')}`);
  console.log(`   Subject: ${subject}`);
}

sendEmail().catch(err => {
  console.error('❌ Send failed:', err.message);
  process.exit(1);
});
