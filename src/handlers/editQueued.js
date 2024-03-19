const { clearView } = require("../lib");

async function editQueued(internalState) {
  clearView();

  console.log(internalState);

  internalState.queuedObject.inhoud = "Fransje";

  console.log(internalState.JSONObject.regels[internalState.editAt]);

  process.exit();
}

module.exports = { editQueued };
