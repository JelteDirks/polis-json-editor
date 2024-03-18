const { HANDLERS } = require("../constants");
const { clearView, showStatus, readOne } = require("../lib");

async function chooseMode(internalState) {

  clearView()

  process.stdout.write("i: Ik wil nieuwe regel objecten toevoegen (insert mode)");
  process.stdout.write("\ne: Ik wil bestaande regel objecten wijzigen (edit mode)");
  process.stdout.write("\nWat wil je doet met het bestand? (default = i)\n");

  const answer = await readOne();

  if (answer.trim() === "i") {
    return HANDLERS.NAVIGATE;
  } else if (answer.trim() === "e") {
    return HANDLERS.EDIT;
  } else {
    return HANDLERS.CHOOSE_MODE;
  }
}


module.exports = { chooseMode };
