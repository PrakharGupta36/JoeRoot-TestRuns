import puppeteer from "puppeteer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(
      "https://www.espncricinfo.com/records/most-hundreds-in-a-career-227046",
      { waitUntil: "domcontentloaded" },
    );

    // Wait for the element to load
    await page.waitForSelector('a[title="JE Root (ENG)"]');

    // Get the link element
    const joeRootLink = await page.$('a[title="JE Root (ENG)"]');
    const joeRootName = await page.evaluate(
      (el) => el.textContent,
      joeRootLink,
    );

    // Get the parent element of the link
    const parentElement = await page.evaluateHandle(
      (el) => el.parentElement.parentElement.parentElement,
      joeRootLink,
    );

    // Get the 4th next sibling element of the parent element
    let siblingElement = parentElement;
    for (let i = 0; i < 5; i++) {
      siblingElement = await page.evaluateHandle(
        (el) => el.nextElementSibling,
        siblingElement,
      );
      if (!siblingElement) {
        break;
      }
    }

    // Get the text content inside the span element
    const spanElement = await page.evaluateHandle(
      (el) => el.querySelector("span"),
      siblingElement,
    );
    let spanText = "";
    if (spanElement) {
      spanText = await page.evaluate((el) => el.textContent, spanElement);
    }

    await browser.close();

    res.status(200).json({ joeRootName, spanText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to scrape data" });
  }
}
