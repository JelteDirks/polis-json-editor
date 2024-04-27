import chalk from "chalk";
import { REGEL_SOORTEN, SOORT_LOOKUP, HANDLERS } from "../constants.js";
import { clearView, readLine, readOne, showStatus } from "../lib.js";

const red = chalk.red;

export async function insert(internalState) {

  if (!internalState.insertAt) {
    console.error("should have internalState.insertAt");
    process.exit();
  }

  let props = "cio";
  if (typeof internalState.argv.defaultProperties === "string") {
    props = internalState.argv.defaultProperties
  }

  internalState.queuedObject = {};

  clearView()
  process.stdout.write(red("\nVoer op enig moment !R (bij teksten) of ! (bij letters) in om opnieuw te beginnen\n"));
  showStatus(internalState.queuedObject);
  process.stdout.write("\nc: condities");
  process.stdout.write("\nd: dekking");
  process.stdout.write("\ni: inhoud");
  process.stdout.write("\no: omschrijving");
  process.stdout.write("\na: achtervoegsel");
  process.stdout.write("\nWelke eigenschappen wil je toevoegen? " +
    "Voer de letters in van de eigenschappen en druk op enter." +
    " Soort wordt altijd toegevoegd. (default = " + props + ")\n");

  let answer = await readLine();
  if (answer.indexOf("!R") > -1) {
    return HANDLERS.INSERT;
  }

  if (answer.trim().length !== 0) {
    props = answer;
  }

  if (props.indexOf("o") > -1) {
    clearView();
    showStatus(internalState.queuedObject);
    process.stdout.write("\nWat is de omschrijving van de regel?\n");

    const omschrijving = await readLine();
    if (omschrijving.indexOf("!R") > -1) {
      return HANDLERS.INSERT;
    }

    Object.assign(internalState.queuedObject, { omschrijving: omschrijving.trim() });
  }

  clearView()
  showStatus(internalState.queuedObject);

  const defaultSoort = "1";

  Object.keys(REGEL_SOORTEN).forEach((key) => {
    process.stdout.write(`\n${REGEL_SOORTEN[key]}: ${key}`);
  });
  process.stdout.write("\n\nWat is de soort? (default = " + defaultSoort + ")\n");

  const soort = await readOne();

  if ((soort.trim().length !== 0) && (typeof SOORT_LOOKUP[soort.trim()] === "string")) {
    Object.assign(internalState.queuedObject, { soort: SOORT_LOOKUP[soort.trim()] });
  } else {
    Object.assign(internalState.queuedObject, { soort: SOORT_LOOKUP[defaultSoort] });
  }

  if (props.indexOf("d") > -1) {
    clearView()
    showStatus(internalState.queuedObject);
    process.stdout.write("\n\nWat is de dekking? (default = geen dekking)\n");

    const dekking = await readLine();
    if (dekking.indexOf("!R") > -1) {
      return HANDLERS.INSERT;
    }

    if (dekking.trim().length !== 0) {
      Object.assign(internalState.queuedObject, { dekking: dekking.trim() });
    }
  }

  if (props.indexOf("i") > -1) {
    clearView();
    showStatus(internalState.queuedObject);
    process.stdout.write("\n\nWat is de inhoud? (default = geen inhoud)\n");

    const inhoud = await readLine();
    if (inhoud.indexOf("!R") > -1) {
      return HANDLERS.INSERT;
    }


    if (inhoud.trim().length !== 0) {
      Object.assign(internalState.queuedObject, { inhoud: inhoud.trim() });
    }
  }

  if (props.indexOf("a") > -1) {

    clearView();
    showStatus(internalState.queuedObject);
    process.stdout.write("\nWat is het achtervoegsel? (default = geen achtervoegsel)\n");

    const achtervoegsel = await readLine();
    if (achtervoegsel.indexOf("!R") > -1) {
      return HANDLERS.INSERT;
    }

    if (achtervoegsel.trim().length !== 0) {
      Object.assign(internalState.queuedObject, { achtervoegsel: achtervoegsel.trim() });
    }
  }

  let change = new String();
  while (1) {
    clearView();
    showStatus(internalState.queuedObject);
    process.stdout.write("\nj: Ja ik wil nog een property wijzigen");
    process.stdout.write("\nn: Nee het object is goed zo");
    process.stdout.write("\nWil je nog een property wijzigen? (default = n)\n");

    change = await readOne();
    if (change.indexOf("!") > -1) {
      return HANDLERS.INSERT;
    }

    if (change.trim() === "j") {
      await wijzigObjectByRef(internalState, internalState.queuedObject);
    } else { break; }
  }

  if (props.indexOf("c") > -1) { // conditions shouuld be added
    return HANDLERS.CONDITIES;
  }

  return HANDLERS.CACHE;
}

async function wijzigObjectByRef(internalState, objectRef) {
  clearView();
  showStatus(objectRef);
  process.stdout.write("\nAlleen strings kunnen hier gewijzigd worden.");
  process.stdout.write("\nTyp de naam van de eigenschap wat gewijzigd moet worden:\n");

  const prop = (await readLine()).trim();
  if (prop.indexOf("!R") > -1) {
    return HANDLERS.INSERT;
  }

  if (typeof objectRef[prop] === "undefined") {
    clearView();
    return wijzigObjectByRef(internalState, objectRef);
  }

  process.stdout.write("\nTyp de nieuwe waarde van de eigenschap:\n");

  const val = (await readLine()).trim();
  if (val.indexOf("!R") > -1) {
    return HANDLERS.INSERT;
  }

  Object.assign(objectRef, {
    [prop]: val
  });
}
