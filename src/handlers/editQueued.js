import { writeFileSync } from "fs";
import { HANDLERS } from "../constants.js";
import { clearView, readLine, readOne } from "../lib.js";

export async function editQueued(internalState) {

  let localRef = internalState.JSONObject.regels[internalState.editAt];

  clearView();
  process.stdout.write(JSON.stringify(localRef, null, 2));
  process.stdout.write("\ni: inhoud");
  process.stdout.write("\no: omschrijving");
  process.stdout.write("\nd: dekking");
  process.stdout.write("\na: achtervoegsel");
  process.stdout.write("\nn: notities");
  process.stdout.write("\ns: soort");
  process.stdout.write("\nJe bent bovenstaand object aan het wijzigen.\nWelke" +
    " eigenschappen van dit object wil je wijzigen?\n");

  let prop = (await readOne()).trim();

  if (typeof mapping[prop] === "undefined") {
    return HANDLERS.EDIT_QUEUED;
  }

  process.stdout.write("\nGeef de nieuwe waarde op voor "
    + mapping[prop] + ": ");


  let newValue = await readLine();

  localRef[mapping[prop]] = newValue.trim();

  clearView();
  process.stdout.write(JSON.stringify(localRef, null, 2));
  process.stdout.write("\nj: Ja het object is correct zo");
  process.stdout.write("\nn: Nee, ik wil nog een keer wijzigen");
  process.stdout.write("\nIs het object correct? (default = j)\n");

  let correct = await readOne();

  if (correct.trim() === "n") {
    return HANDLERS.EDIT_QUEUED;
  }

  let data = JSON.stringify(internalState.JSONObject, null, 2);

  writeFileSync(internalState.argv.file, data);

  return HANDLERS.CHOOSE_MODE;
}


const mapping = {
  "o": "omschrijving",
  "i": "inhoud",
  "d": "dekking",
  "a": "achtervoegsel",
  "n": "notities",
  "s": "soort"
};
