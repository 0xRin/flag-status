// library imports
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import puppeteer from "puppeteer";

// initialize express app
const app: Express = express();
dotenv.config();

// define port
const PORT = process.env.PORT || 3000;

// get flag status text
const getFlagStatus = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(process.env.TARGET_SITE as string);
  // grab the element w/ given html selectors
  const textSelector = await page.waitForSelector(".disclose h2");
  const flagStatusTag = await textSelector?.evaluate((el) => el.textContent);

  // format the text
  const flagStatusText = flagStatusTag?.replace(/\s+/g, "").toUpperCase();

  console.log(flagStatusText);
};

try {
  getFlagStatus();
} catch (e: Error | unknown) {
  if (e instanceof Error) console.log(e.message);
}

app.listen(PORT, () => {
  console.log(`😎[server]: Server is running on port ${PORT}`);
});
