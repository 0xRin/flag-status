import { Twilio } from "twilio";

// twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const myNumber = process.env.MY_NUMBER;

const client = new Twilio(accountSid, authToken);

// sends the message w/ given flag status as message
export const createMessage = async (msg: string) => {
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
