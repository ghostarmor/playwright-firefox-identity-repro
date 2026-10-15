import { test, expect, firefox } from "@playwright/test";
import { createServer } from "node:http";

// Same check as example.spec.ts, against the raw Camoufox binary (no launcher), which
// carries its own copy of Playwright's Juggler.
const executablePath = process.env.CAMOUFOX_EXECUTABLE;

test("Camoufox response.text handles Content-Encoding: Identity", async () => {
  test.skip(!executablePath, "Set CAMOUFOX_EXECUTABLE to a Camoufox binary");

  const server = createServer((_request, response) => {
    response.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Encoding": "Identity",
    });
    response.end("hello");
  });

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Server did not bind to a TCP port");

  const browser = await firefox.launch({ executablePath, headless: true });
  try {
    // viewport: null avoids viewport fields that Camoufox builds before beta.30 reject.
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    const response = await page.goto(`http://127.0.0.1:${address.port}/`);
    if (!response) throw new Error("Navigation did not return a response");
    expect(await response.text()).toBe("hello");
  } finally {
    await browser.close();
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
});
