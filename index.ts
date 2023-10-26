// library imports
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import { Twilio } from "twilio";

// initialize express app
const app: Express = express();
dotenv.config();

// define port
const PORT = process.env.PORT || 3000;

// twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const myNumber = process.env.MY_NUMBER;

const client = new Twilio(accountSid, authToken);

// sends the message w/ given flag status as message
const createMessage = async (msg: string) => {
  try {
    // sends the request to twilio to send the message
    const res = await client.messages.create({
      from: twilioNumber,
      to: myNumber as string,
      body: `${msg}`,
    });
    console.log(`Message ${res.sid} sent!`);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    } else {
      console.log("Missing one of the variables needed to send message");
    }
  }
};

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

// main driver that calls scaper and message functions
// also handles logic for output depending on flag status
try {
  const output = "Today's flag is flown at";

  getFlagStatus().then((status) => {
    if (status === Status.Full) {
      createMessage(`${StatusEmojis.Full} ${output} full staff`);
    } else if (status === Status.Half) {
      createMessage(`${StatusEmojis.Half} ${output} half staff`);
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
