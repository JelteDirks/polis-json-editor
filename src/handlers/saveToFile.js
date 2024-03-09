const { writeFileSync } = require("node:fs");
const { clearView, readOne } = require("../lib");

async function saveToFile(internalState) {
  clearView();
  process.stdout.write("De volgende regel objecten worden opgeslagen\n");
  console.log(internalState.cachedObjects);
  process.stdout.write("Weet je zeker dat je het huidige bestand wil overschrijven?\n");

  const answer = await readOne();

  if (answer.trim() === "j") {
    internalState.JSONObject.regels.splice
      (
        internalState.insertAt.index + internalState.insertAt.direction, // positie om elementen in te voegen
        0, // aantal elementen die verwijderd moeten worden
        ...internalState.cachedObjects // de nieuwe elementen
      );

    const data = JSON.stringify(internalState.JSONObject, null, 2);

    writeFileSync(
      internalState.argv.file,
      data,
      {
        flag: "w" // truncate existing file
      }
    );

    console.log("Bestand opgeslagen!");
    process.exit();
  }

}

module.exports = {
  saveToFile
};
