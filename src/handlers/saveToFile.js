const { writeFileSync } = require("node:fs");
const { clearView, readOne } = require("../lib");
const path = require("node:path");

async function saveToFile(internalState) {
  clearView();
  process.stdout.write("De volgende regel objecten worden opgeslagen\n");
  console.log(internalState.cachedObjects);
  process.stdout.write("\nj: Ja ik wil het huidige bestand overschrijven");
  process.stdout.write("\nn: Nee, ik wil een nieuw bestand maken");
  process.stdout.write("\nWeet je zeker dat je het huidige bestand wil overschrijven? (default = j)\n");

  internalState.JSONObject.regels.splice(
    internalState.insertAt.index + internalState.insertAt.direction, // positie om elementen in te voegen
    0, // aantal elementen welke verwijderd moeten worden
    ...internalState.cachedObjects // de nieuwe elementen
  );

  const data = JSON.stringify(internalState.JSONObject, null, 2);

  const answer = await readOne();

  if (answer.trim() === "n") {
    const newPath = path.resolve("nieuw." + internalState.argv.file);
    writeFileSync(newPath, data, {
      flag: "w" // create new file
    });
    console.log("Nieuw bestand aangemaakt:", newPath);
  } else {
    writeFileSync(internalState.argv.file, data, {
      flag: "w" // truncate existing file
    });

    console.log("Bestand overschreven:", internalState.argv.file);
    process.exit();
  }

}

module.exports = {
  saveToFile
};
