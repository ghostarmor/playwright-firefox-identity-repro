import { test, expect } from "@playwright/test";
import { createServer } from "node:http";

test("response.text handles Content-Encoding: Identity", async ({ page }) => {
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

  try {
    const response = await page.goto(`http://127.0.0.1:${address.port}/`);
    if (!response) throw new Error("Navigation did not return a response");
    expect(await response.text()).toBe("hello");
  } finally {
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
