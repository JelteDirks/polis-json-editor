#!/opt/homebrew/bin/node

const { HANDLERS } = require("./src/constants");

(async () => {
  const { createClI, validateCLIInput } = require("./src/cli");
  const path = require("node:path");
  const { readFileSync } = require("node:fs");
  const { nextHandler } = require("./src/handlers");

  const argv = createClI(process.argv)
  validateCLIInput(argv);

  const resolvedFile = path.resolve(argv.file);
  const JSONObject = require(resolvedFile);

  let stateNumber = -1;
  let stateHandler = () => { };

  let internalState = {
    JSONObject: JSONObject,
    argv: argv
  };

  if (typeof argv.cacheFile === "string") {
    let resolvedCacheFile = path.resolve(argv.cacheFile);
    try {
      let cachedObjects = JSON.parse(readFileSync(resolvedCacheFile));
      if (!(cachedObjects instanceof Array)) {
        console.error("Het cache bestand is niet correct geformatteerd");
        console.error(resolvedCacheFile);
        process.exit(55);
      }
      Object.assign(internalState, {
        cachedObjects: cachedObjects
      });
    } catch (error) {
      console.error("Probleem bij het parsen van de cache file");
      console.error(error);
      process.exit(54);
    }
  }

  if ((argv.i & argv.s) === 1) {
    ({ stateNumber: id, handler: stateHandler } = nextHandler(HANDLERS.NAVIGATE));
  } else {
    ({ stateNumber: id, handler: stateHandler } = nextHandler(HANDLERS.CHOOSE_MODE));
  }

  while (1) {
    stateNumber = await stateHandler(internalState);
    ({ stateNumber: id, handler: stateHandler } = nextHandler(stateNumber));
  }

  console.log(JSON.stringify(JSONObject, null, 2).slice(0, 100));

  return 0;
})();
