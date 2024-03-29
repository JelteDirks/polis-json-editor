import { writeFileSync, unlinkSync } from "node:fs";
import { clearView, readOne } from "../lib.js";
import { resolve } from "node:path";
import { HANDLERS } from "../constants.js";

export async function saveToFile(internalState) {
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
    const newPath = resolve(internalState.argv.file + ".nieuw");
    writeFileSync(newPath, data, {
      flag: "w" // create new file
    });
    console.log("Nieuw bestand aangemaakt:", newPath);
  } else {
    writeFileSync(internalState.argv.file, data, {
      flag: "w" // truncate existing file
    });

    console.log("Bestand overschreven:", internalState.argv.file);
  }

  if (typeof internalState.cacheFile === "string") {
    unlinkSync(internalState.cacheFile, (err) => {
      if (err) {
        console.error("problem removing cached file after saving");
        console.error(err);
        process.exit(10);
      }
    });
  }

  // reset cached objects after they are saved to file
  internalState.cachedObjects = [];

  return HANDLERS.CHOOSE_MODE;
}
