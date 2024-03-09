const { DIRECTION, ESCAPE_SEQUENCE } = require("./constants");
const { readOne } = require("./lib");

async function navigate(internalState) {

  let i = 0;

  while (1) {

    if (i < 0 || i > internalState.JSONObject.regels.length) {
      i = 0; // TODO: fix out of bounds properly
    }

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
      return 2;
    } else if (answer.startsWith("l")) {
      i = i + 1; // next index
      continue;
    } else if (answer.startsWith("h")) {
      i = i - 1; // next index
      continue;
    } else if (answer.startsWith("q")) {
      console.error("aborting");
      process.exit(7);
    }
  }

  return 2;
}

const stateLibrary = [
  {
    id: 1,
    handler: navigate
  }
];

function nextHandler(id) {
  for (let i = 0; i < stateLibrary.length; i++) {
    if (stateLibrary[i].id === id) {
      return stateLibrary[i];
    }
  }

  console.error("geen state met id:", id);
  process.exit(22);
}

module.exports = {
  navigate: navigate,
  nextHandler: nextHandler
};
