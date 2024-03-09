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
  process.stdout.write("Het volgende object is klaar om toegevoegd te worden:\n");
  showStatus(internalState.queuedObject);
  process.stdout.write("\n\nWil je nog een object toevoegen?\n");

  const answer = await readOne();

  if (answer.trim() === "j") {
    return 2;
  }

  return 5;
}

module.exports = {
  cache
};
