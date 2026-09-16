import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const files = process.argv.slice(2);
const browser = await chromium.launch();

for (const file of files) {
  const abs = resolve(file);
  const svg = readFileSync(abs, "utf8");
  const data = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  for (const size of [16, 32, 64]) {
    const page = await browser.newPage({
      viewport: { width: size, height: size },
      deviceScaleFactor: 1,
    });
    await page.setContent(
      `<!doctype html><html><body style="margin:0;background:#888">
        <img src="${data}" width="${size}" height="${size}" style="display:block;image-rendering:auto">
      </body></html>`,
      { waitUntil: "load" },
    );
    const stem = abs.replace(/\.svg$/, `-${size}.png`);
    await page.screenshot({ path: stem, omitBackground: false });
    await page.close();
    console.log("wrote", stem);
  }
}

await browser.close();
