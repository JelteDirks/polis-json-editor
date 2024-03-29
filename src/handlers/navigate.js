import { DIRECTION, ESCAPE_SEQUENCE, HANDLERS } from "../constants.js";
import { readOne } from "../lib.js";

export async function navigateInsert(internalState) {

  let i = 0;
  const len = internalState.JSONObject.regels.length;

  if (typeof len === "undefined") {
    console.error("could not find length the regels array");
    process.exit(24);
  }

  while (1) {

    const o = internalState.JSONObject.regels[i];
    const asStr = JSON.stringify(o, null, 2);

    process.stdout.write(ESCAPE_SEQUENCE.CLEAR_TERM);
    process.stdout.write(asStr + "\n");
    process.stdout.write("k: ik wil boven deze regel beginnen met invoegen\n");
    process.stdout.write("j: ik wil onder deze regel beginnen met invoegen\n");
    process.stdout.write("l: ik wil de volgende regel bekijken\n");
    process.stdout.write("h: ik wil de vorige regel bekijken\n");
    process.stdout.write("e: ik wil liever een object aanpassen\n");
    process.stdout.write("q: abort\n");

    process.stdin.read();

    const answer = await readOne();

    if (answer.trim() === "e") {
      return HANDLERS.NAVIGATE_EDIT;
    }

    if (answer.trim() === "k") {
      Object.assign(internalState, {
        insertAt: { direction: DIRECTION.BEFORE, index: i }
      });
      return HANDLERS.INSERT;
    } else if (answer.trim() === "j") {
      Object.assign(internalState, {
        insertAt: { direction: DIRECTION.AFTER, index: i }
      });
      return HANDLERS.INSERT;
    } else if (answer.trim() === "l") {
      i = (i + 1 + len) % len;
      continue;
    } else if (answer.trim() === "h") {
      i = (i - 1 + len) % len;
      continue;
    } else if (answer.trim() === "q") {
      console.error("aborting");
      process.exit(7);
    }
  }

  return HANDLERS.INSERT;
}
