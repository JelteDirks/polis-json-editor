async function saveToFile(internalState) {
  console.log("saving internal state");
  console.dir(internalState);
  process.exit();
}

module.exports = {
  saveToFile
};
