#!/opt/homebrew/bin/node

import { createClI, validateCLIInput } from "./src/cli.js";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { nextHandler } from "./src/handlers.js";
import { HANDLERS } from "./src/constants.js";

(async () => {

  const argv = createClI(process.argv)
  validateCLIInput(argv);

  const resolvedFile = resolve(argv.file);
  const JSONObject = JSON.parse(readFileSync(resolvedFile));

  let stateNumber = -1;
  let stateHandler = () => { };

  let internalState = {
    JSONObject: JSONObject,
    argv: argv
  };

  if (typeof argv.cacheFile === "string") {
    let resolvedCacheFile = resolve(argv.cacheFile);
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
    ({ handler: stateHandler } = nextHandler(HANDLERS.NAVIGATE_INSERT));
  } else {
    ({ handler: stateHandler } = nextHandler(HANDLERS.CHOOSE_MODE));
  }

  while (1) {
    stateNumber = await stateHandler(internalState);
    ({ handler: stateHandler } = nextHandler(stateNumber));
  }

  console.log(JSON.stringify(JSONObject, null, 2).slice(0, 100));

  return 0;
})();
