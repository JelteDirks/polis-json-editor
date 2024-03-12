const { writeFile } = require("node:fs");
const { clearView, showStatus, readOne, deepClone } = require("../lib");
const path = require("node:path");
const { HANDLERS } = require("../constants");

async function cache(internalState) {
  if (!internalState.queuedObject) {
    console.error("should have queued object by now");
    process.exit();
  }

  if (!internalState.cachedObjects) {
    Object.assign(internalState, {
      cachedObjects: [deepClone(internalState.queuedObject)]
    });
  } else {
    internalState.
      cachedObjects.push(deepClone(internalState.queuedObject));
  }

  clearView();
  showStatus(internalState.queuedObject);
  process.stdout.write("\n\nBovenstaand object is klaar om toegevoegd te worden.");
  process.stdout.write("\nj: Ja ik wil nog een object toevoegen");
  process.stdout.write("\nn: Nee ik wil geen object meer toevoegen");
  process.stdout.write("\nWil je nog een object toevoegen? (default = j)\n");

  internalState.cacheFile = path.resolve(internalState.argv.file + ".cache");

  const data = JSON.stringify(internalState.cachedObjects);

  writeFile(internalState.cacheFile, data, (err) => {
    if (err) {
      console.error("problem saving cache file, this was not done correctly");
      console.error(err);
      process.exit(9);
    }
  });

  const answer = await readOne();

  if (answer.trim() === "n") {
    return HANDLERS.SAVETOFILE;
  }

  return HANDLERS.INSERT;
}

module.exports = {
  cache
};
