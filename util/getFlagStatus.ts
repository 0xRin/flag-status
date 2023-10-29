import puppeteer from "puppeteer";

// get flag status text
export const getFlagStatus = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disabe-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(process.env.TARGET_SITE as string);
  // grab the element w/ given html selectors
  const textSelector = await page.waitForSelector(".disclose h2");
  const flagStatusTag = await textSelector?.evaluate((el) => el.textContent);

  // format the text
  const flagStatusText = flagStatusTag?.replace(/\s+/g, "").toUpperCase();

  // close browser; better to leave it open or close?
  browser.close();

  return flagStatusText;
};
