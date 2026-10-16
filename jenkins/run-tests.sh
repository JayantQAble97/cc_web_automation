#!/bin/bash
#
# Jenkins entry point: run a Playwright suite, then always send the email
# report and (optionally) a Teams notification, mirroring the GitHub Actions
# workflows in .github/workflows/. Build fails iff the tests failed.
#
# Required env vars (set as Jenkins job parameters or in the build step):
#   CLIENT    e.g. BOBCARD, BOB, IDFC
#   PROJECT   e.g. shopstacc-chrome-UAT, tripstacc-chrome-UAT-mobile-iphone13
#
# Optional env vars:
#   FEATURE_TAG      grep tag without @, e.g. Smoke
#   WORKERS          default 4
#   RETRIES          default 2
#   MS_TEAMS_WEBHOOK Teams incoming-webhook URL; Teams step is skipped if unset
#   REPORT_TITLE     must match the "Report Titles" field configured in the
#                    Jenkins "Publish HTML reports" post-build action
#                    (default: "Playwright HTML Report")
#
# Must be run from the repository root (this is where Jenkins' git checkout
# step places the workspace).

set -e

: "${CLIENT:?CLIENT env var is required, e.g. CLIENT=BOBCARD}"
: "${PROJECT:?PROJECT env var is required, e.g. PROJECT=shopstacc-chrome-UAT}"

WORKERS="${WORKERS:-4}"
RETRIES="${RETRIES:-2}"
REPORT_TITLE="${REPORT_TITLE:-Playwright HTML Report}"
REPORT_SLUG="$(echo "$REPORT_TITLE" | tr ' ' '_')"

echo "== Installing dependencies =="
npm ci

echo "== Installing Playwright browser =="
BROWSER_PART="$(echo "$PROJECT" | cut -d'-' -f2)"
case "$BROWSER_PART" in
  firefox) node_modules/.bin/playwright install --with-deps firefox ;;
  webkit)  node_modules/.bin/playwright install --with-deps webkit ;;
  *)       node_modules/.bin/playwright install --with-deps chrome ;;
esac

# From here on, don't abort on a failing command — tests failing is expected
# and reporting/notification steps must still run (mirrors "continue-on-error"
# + "if: always()" in the GitHub Actions workflows).
set +e

mkdir -p reports

EXTRA_ARGS=()
if [ -n "${FEATURE_TAG:-}" ]; then
  EXTRA_ARGS+=(--grep "@${FEATURE_TAG}")
fi

echo "== Running Playwright tests (CLIENT=$CLIENT PROJECT=$PROJECT) =="
CLIENT="$CLIENT" PROJECT="$PROJECT" node_modules/.bin/playwright test \
  --config=playwright.config.ts \
  --workers="$WORKERS" \
  --retries="$RETRIES" \
  "${EXTRA_ARGS[@]}"
TEST_EXIT_CODE=$?

echo "== Generating report summary =="
node .github/scripts/generate-report-summary.js reports/test-results.json reports/email-summary.txt
# shellcheck disable=SC1091
[ -f reports/stats.env ] && source reports/stats.env

REPORT_URL="${BUILD_URL:-}${REPORT_SLUG}/"

echo "== Sending email report =="
CLIENT="$CLIENT" PROJECT="$PROJECT" REPORT_URL="$REPORT_URL" node utils/send-report-email.js
if [ $? -ne 0 ]; then
  echo "WARNING: email step failed, continuing"
fi

if [ -n "${MS_TEAMS_WEBHOOK:-}" ]; then
  echo "== Notifying MS Teams =="
  EMOJI="🟢"
  [ "${STATUS:-PASSED}" = "FAILED" ] && EMOJI="🔴"
  curl -s -X POST "$MS_TEAMS_WEBHOOK" -H "Content-Type: application/json" -d "{
    \"type\": \"message\",
    \"attachments\": [{
      \"contentType\": \"application/vnd.microsoft.card.adaptive\",
      \"content\": {
        \"\$schema\": \"http://adaptivecards.io/schemas/adaptive-card.json\",
        \"type\": \"AdaptiveCard\",
        \"version\": \"1.4\",
        \"body\": [
          { \"type\": \"TextBlock\", \"text\": \"${EMOJI} ${CLIENT} ${PROJECT} — ${STATUS:-UNKNOWN}\", \"weight\": \"Bolder\", \"size\": \"Medium\", \"wrap\": true },
          { \"type\": \"FactSet\", \"facts\": [
            { \"title\": \"Status\", \"value\": \"${STATUS:-UNKNOWN}\" },
            { \"title\": \"Total\", \"value\": \"${TOTAL:-0}\" },
            { \"title\": \"Passed\", \"value\": \"✅ ${PASSED:-0}\" },
            { \"title\": \"Failed\", \"value\": \"❌ ${FAILED:-0}\" },
            { \"title\": \"Skipped\", \"value\": \"⏭️ ${SKIPPED:-0}\" },
            { \"title\": \"Flaky\", \"value\": \"⚠️ ${FLAKY:-0}\" },
            { \"title\": \"Duration\", \"value\": \"⏱️ ${DURATION:-0s}\" }
          ]}
        ],
        \"actions\": [
          { \"type\": \"Action.OpenUrl\", \"title\": \"📊 View Playwright Report\", \"url\": \"${REPORT_URL}\" },
          { \"type\": \"Action.OpenUrl\", \"title\": \"🔗 View Build\", \"url\": \"${BUILD_URL:-}\" }
        ]
      }
    }]
  }" > /dev/null
  if [ $? -ne 0 ]; then
    echo "WARNING: Teams notification failed, continuing"
  fi
fi

echo "== Done (test exit code: $TEST_EXIT_CODE) =="
exit $TEST_EXIT_CODE
