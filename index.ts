// library imports
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import puppeteer from "puppeteer";

// initialize express app
const app: Express = express();
dotenv.config();

// define port
const PORT = process.env.PORT || 3000;

// holds possible flag statuses for string comparison
enum Status {
  Half = "HALFSTAFF",
  Full = "FULLSTAFF",
}

enum StatusEmojis {
  Half = "🚨",
  Full = "🇺🇸",
}

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

  return flagStatusText;
};

const output = "Today's flag is flown at";

try {
  // lets output the status in readable notification
  getFlagStatus().then((status) => {
    if (status === Status.Full) {
      console.log(`${StatusEmojis.Full} ${output} full staff`);
    } else if (status === Status.Half) {
      console.log(`${StatusEmojis.Half} ${output} half staff`);
    } else {
      throw new Error(`Cannot determine flag status! Got ${status} as status`);
    }
  });
} catch (e: Error | unknown) {
  if (e instanceof Error) console.log(e.message);
}

app.listen(PORT, () => {
  console.log(`😎[server]: Server is running on port ${PORT}`);
});
