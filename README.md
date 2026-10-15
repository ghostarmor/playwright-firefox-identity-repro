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

## Camoufox

The same failure reproduces in [Camoufox](https://github.com/daijro/camoufox), which ships its own copy of Playwright's Juggler. `tests/camoufox.spec.ts` launches the raw Camoufox binary with Playwright, without a launcher. It is skipped unless `CAMOUFOX_EXECUTABLE` is set.

```sh
CAMOUFOX_EXECUTABLE=/path/to/camoufox npx playwright test --project=camoufox
```

Use the binary from any [Camoufox release](https://github.com/daijro/camoufox/releases), for example `Camoufox.app/Contents/MacOS/camoufox` on macOS. The test fails with:

```text
response.text: Protocol error (Network.getResponseBody): Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIStreamConverterService.asyncConvertData]
```

Reproduced with Camoufox v152.0.4-beta.29 (macOS) and v156.0.1-beta.36 (Linux).
