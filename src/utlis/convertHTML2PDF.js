import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function convertHTML2PDF(html, { generateHtmlBoilerPlate = true } = {}) {
  let htmlDoc = generateHtmlBoilerPlate
    ? `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `
    : html;

  const isLocal = process.env.NODE_ENV === "development";

  let browser;

  try {
    let launchOptions;

    if (!isLocal) {
      // CLOUD / VERCEL MODE
      const exePath = await chromium.executablePath();

      launchOptions = {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: exePath,
        headless: chromium.headless,
      };
    } else {
      // LOCAL MODE (WINDOWS / MAC)
      launchOptions = {
        headless: true,
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", // Windows Chrome path
      };
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    await page.setContent(htmlDoc, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return pdf;
  } catch (err) {
    console.error("PDF ERROR:", err);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
}
