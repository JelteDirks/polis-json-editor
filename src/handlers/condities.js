const { clearView, showStatus, readOne, readLine } = require("../lib");

async function condities(internalState) {
  const { i, b, s } = internalState.argv;

  if ((i & b & s) !== 1) {
    console.error("only support -i -b -s");
    process.exit();
  }

  Object.assign(internalState.queuedObject, {
    condities: []
  });

  clearView();
  showStatus(internalState.queuedObject);
  process.stdout.write("\ne: EN conditie\no: OF conditie ");
  process.stdout.write("\nWelk soort conditie wil je toevoegen? (default = EN conditie)\n");

  let answer = await readOne();

  if (answer.trim() === "o") {
    internalState.queuedObject.condities.push("OF");
  } else {
    internalState.queuedObject.condities.push("EN");
  }

  while (1) {
    clearView();
    showStatus(internalState.queuedObject);
    process.stdout.write("\nm: maatschappij\n");
    process.stdout.write("l: labels\n");
    process.stdout.write("w: waardes\n");
    process.stdout.write("d: dekkingen\n");
    process.stdout.write("b: branches\n");
    process.stdout.write("o: omgedraaid\n");
    process.stdout.write("Welke eigenschappen wil je in de condities hebben?" +
      " Typ alle letters die van toepassing zijn: (default = ml)\n");

    const flags = await readLine();

    if (flags.trim().length === 0) {
      await maakConditie("ml", internalState);
    } else {
      await maakConditie(flags.trim(), internalState);
    }

    clearView();
    showStatus(internalState.queuedObject);
    process.stdout.write("\nj: ja ik wil meer condities toevoegen");
    process.stdout.write("\nn: nee ik wil geen condities meer toevoegen");
    process.stdout.write("\nWil je meer condities toevoegen? (default = n)\n");

    let answer = await readOne();

    if (answer.trim() !== "j") {
      break;
    }
  }

  return 4;
}

async function maakConditie(flags, internalState) {
  const conditieObj = {};

  if (flags.indexOf("m") > -1) {
    clearView();
    showStatus(conditieObj);
    process.stdout.write("\nWelke maatschappijen wil je toevoegen aan deze " +
      "conditie? Gebruik een spatie om ze te scheiden. (Voorbeeld:P302 P353 P380)\n");

    let answer = await readLine();

    Object.assign(conditieObj, {
      maatschappijen: answer.trim().split(" ")
    });
  }

  // only quick fill is supported for now
  if (flags.indexOf("l") > -1) {
    Object.assign(conditieObj, {
      labels: extractLabels(internalState)
    });
  }

  // only quick fill is supported for now
  if (flags.indexOf("o") > -1) {
    Object.assign(conditieObj, { omgedraaid: true });
  }

  clearView();
  showStatus(conditieObj);
  process.stdout.write("\nj: Ja dit conditie object is correct");
  process.stdout.write("\nn: Nee dit conditie object wil ik opnieuw doen");
  process.stdout.write("\nIs dit conditie object correct? (default = j)\n");
  let answer = await readOne();

  if (answer.trim() === "n") {
    return maakConditie(flags, internalState);
  } else {
    internalState.queuedObject.condities.push(conditieObj);
  }
}

function extractLabels(internalState) {
  const { omschrijving, inhoud } = internalState.queuedObject;
  const labels = [];

  console.log("omschrijving", omschrijving);
  console.log("inhoud", inhoud);

  if (typeof omschrijving === "string") {
    let ol = getlabels(omschrijving);
    labels.splice(labels.length, 0, ...ol);
  }

  if (typeof inhoud === "string") {
    let il = getlabels(inhoud);
    labels.splice(labels.length, 0, ...il);
  }

  console.log("labels concatenated", labels);

  return labels;
}

let pattern = new RegExp("[dr]?[0-9]{5}[oc]?", "g")

function getlabels(str) {
  const labels = str.match(pattern);

  if (labels === null) {
    return [];
  }

  console.log("==", labels);

  return labels;
}


module.exports = {
  condities
};
