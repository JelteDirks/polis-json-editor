const { DIRECTION, ESCAPE_SEQUENCE, HANDLERS } = require("../constants.js");
const { readOne } = require("../lib.js");

async function navigate(internalState) {

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
    process.stdout.write("q: abort\n");

    process.stdin.read();

    const answer = await readOne();

    console.dir(answer);

    if (answer.startsWith("k")) {
      Object.assign(internalState, {
        insertAt: { direction: DIRECTION.BEFORE, index: i }
      });
      return 2;
    } else if (answer.startsWith("j")) {
      Object.assign(internalState, {
        insertAt: { direction: DIRECTION.AFTER, index: i }
      });
      return HANDLERS.INSERT;
    } else if (answer.startsWith("l")) {
      i = (i + 1 + len) % len;
      continue;
    } else if (answer.startsWith("h")) {
      i = (i - 1 + len) % len;
      continue;
    } else if (answer.startsWith("q")) {
      console.error("aborting");
      process.exit(7);
    }
  }

  return HANDLERS.INSERT;
}

module.exports = {
  navigate
};
