import { getFlagStatus } from "./getFlagStatus";
import { createMessage } from "./createMessage";

// holds possible flag statuses for string comparison
enum Status {
  HALF = "HALFSTAFF",
  FULL = "FULLSTAFF",
}

enum StatusEmojis {
  HALF = "🚨",
  FULL = "🇺🇸",
}

// main driver that calls scaper and message functions
// also handles logic for output depending on flag status
export const run = () => {
  const output = "Today's flag is flown at";

  try {
    getFlagStatus().then((status) => {
      if (status === Status.FULL) {
        createMessage(`${StatusEmojis.FULL} ${output} full staff`);
      } else if (status === Status.HALF) {
        createMessage(`${StatusEmojis.HALF} ${output} half staff`);
      } else {
        throw new Error(
          `Cannot determine flag status! Got ${status} as status`
        );
      }
    });
  } catch (e: Error | unknown) {
    if (e instanceof Error) console.log(e.message);
  }
};
