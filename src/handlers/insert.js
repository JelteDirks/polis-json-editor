const { REGEL_SOORTEN, SOORT_LOOKUP } = require("../constants");
const { clearView, readLine, readOne, showStatus } = require("../lib");

async function insert(internalState) {

  if (!internalState.insertAt) {
    console.error("should have internalState.insertAt");
    process.exit();
  }

  clearView();

  internalState.queuedObject = {};

  clearView()
  showStatus(internalState.queuedObject);
  process.stdout.write("\nc: condities");
  process.stdout.write("\nd: dekking");
  process.stdout.write("\ni: inhoud");
  process.stdout.write("\no: omschrijving");
  process.stdout.write("\ne: extraOmschrijving");
  process.stdout.write("\nWelke eigenschappen wil je toevoegen? " +
    "Voer de letters in van de eigenschappen en druk op enter." +
    " Soort wordt altijd toegevoegd. (default = cio)\n");

  let answer = await readLine();
  let props = "cio";

  if (answer.trim().length !== 0) {
    props = answer;
  }

  if (props.indexOf("o") > -1) {
    clearView();
    showStatus(internalState.queuedObject);
    process.stdout.write("\nWat is de omschrijving van de regel?\n");

    const omschrijving = await readLine();

    Object.assign(internalState.queuedObject, { omschrijving: omschrijving.trim() });
  }

  clearView()
  showStatus(internalState.queuedObject);
  Object.keys(REGEL_SOORTEN).forEach((key) => {
    process.stdout.write(`\n${REGEL_SOORTEN[key]}: ${key}`);
  });
  process.stdout.write("\n\nWat is de soort? (default = 1)\n");

  const soort = await readOne();

  if ((soort.trim().length !== 0) && (typeof SOORT_LOOKUP[soort.trim()] === "string")) {
    Object.assign(internalState.queuedObject, { soort: SOORT_LOOKUP[soort.trim()] });
  } else {
    Object.assign(internalState.queuedObject, { soort: SOORT_LOOKUP["1"] });
  }

  if (props.indexOf("d") > -1) {
    clearView()
    showStatus(internalState.queuedObject);
    process.stdout.write("\n\nWat is de dekking? (default = geen dekking)\n");

    const dekking = await readLine();

    if (dekking.trim().length !== 0) {
      Object.assign(internalState.queuedObject, { dekking: dekking.trim() });
    }
  }

  if (props.indexOf("i") > -1) {
    clearView();
    showStatus(internalState.queuedObject);
    process.stdout.write("\n\nWat is de inhoud? (default = geen inhoud)\n");

    const inhoud = await readLine();

    if (inhoud.trim().length !== 0) {
      Object.assign(internalState.queuedObject, { inhoud: inhoud.trim() });
    }
  }

  if (props.indexOf("e") > -1) {

    clearView();
    showStatus(internalState.queuedObject);
    process.stdout.write("\nWat is de extraOmschrijving? (default = geen extraOmschrijving)\n");

    const extraOmschrijving = await readLine();

    if (extraOmschrijving.trim().length !== 0) {
      Object.assign(internalState.queuedObject, { extraOmschrijving: extraOmschrijving.trim() });
    }
  }

  if (props.indexOf("c") > -1) { // conditions shouuld be added
    return 3;
  }

  return 4;
}

module.exports = {
  insert
};
