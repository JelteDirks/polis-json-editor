#!/opt/homebrew/bin/node

(async () => {
  const { createClI, validateCLIInput } = require("./src/cli");
  const path = require("path");
  const { nextHandler } = require("./src/handlers");

  const argv = createClI(process.argv)
  const resolvedFile = path.resolve(argv.file);

  validateCLIInput(resolvedFile, argv);

  const JSONObject = require(resolvedFile);

  let stateNumber = -1;
  let stateHandler = () => { };

  let internalState = {
    JSONObject: JSONObject,
    argv: argv
  };

  if ((argv.i & argv.b & argv.s) === 1) {
    ({ stateNumber: id, handler: stateHandler } = nextHandler(1)); // start with navigation
  }

  while (1) {
    stateNumber = await stateHandler(internalState);
    ({ stateNumber: id, handler: stateHandler } = nextHandler(stateNumber));
  }

  console.log(JSON.stringify(JSONObject, null, 2).slice(0, 100));

  return 0;
})();
