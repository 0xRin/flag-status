// library imports
import express, { Express } from "express";
import dotenv from "dotenv";
import cron from "node-cron";

// bring in env before local imports
dotenv.config();

// local imports
import { createMessage } from "./util/createMessage";
import { run } from "./util/run";

// initialize express app
const app: Express = express();

// define port
const PORT = process.env.PORT || 3000;

// runs the driver with given schedule
// every day at 07:00 EST
cron.schedule(
  "0 7 * * *",
  () => {
    run();
  },
  { timezone: "America/New_York" }
);

app.listen(PORT, () => {
  console.log(`😎[server]: Server is running on port ${PORT}`);
  createMessage("It's working");
});
