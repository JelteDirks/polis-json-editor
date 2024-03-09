const { clearView, showStatus, readOne, deepClone } = require("../lib");

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

  const answer = await readOne();

  if (answer.trim() === "n") {
    return 5;
  }

  return 2;
}

module.exports = {
  cache
};
