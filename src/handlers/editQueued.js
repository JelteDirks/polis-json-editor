const { clearView, readLine } = require("../lib");

async function editQueued(internalState) {

  let localRef = internalState.JSONObject.regels[internalState.editAt];

  clearView();
  process.stdout.write(JSON.stringify(localRef, null, 2));
  process.stdout.write("\ni: inhoud");
  process.stdout.write("\no: omschrijving");
  process.stdout.write("\nd: dekking");
  process.stdout.write("\na: achtervoegsel");
  process.stdout.write("\nn: notities");
  process.stdout.write("\ns: soort");
  process.stdout.write("\nJe bent bovenstaand object aan het wijzigen.\nWelke" +
    " eigenschappen van dit object wil je wijzigen?\n");

  let answer = readLine();

  process.exit();
}

module.exports = { editQueued };
