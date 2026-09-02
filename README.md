# Playwright Firefox `Content-Encoding: Identity` reproduction

This repository reproduces a Firefox-only failure when Playwright reads a response body whose `Content-Encoding` header is `Identity`.

## Run the reproduction

```sh
npm ci
npx playwright install firefox chromium
npx playwright test --project=firefox
```

The Firefox test fails when `response.text()` calls `Network.getResponseBody`. The same test passes in Chromium:

```sh
npx playwright test --project=chromium
```

Tested with Playwright 1.62.1.
