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
      "conditie? Gebruik een spatie om ze te scheiden.\n");

    let answer = await readLine();

    Object.assign(conditieObj, {
      maatschappijen: answer.trim().split(" ")
    });
  }

  // only quick fill is supported for now
  if (flags.indexOf("l") > -1) {
    Object.assign(conditieObj, {
      labels: "voor nu even dit"
    });
  }

  // only quick fill is supported for now
  if (flags.indexOf("o") > -1) {
    Object.assign(conditieObj, { omgedraaid: true });
  }

  clearView();
  process.stdout.write("\nIs dit correct?\n");
  showStatus(conditieObj);
  let answer = await readOne();

  if (answer.trim() === "j") {
    internalState.queuedObject.condities.push(conditieObj);
  } else {
    return maakConditie(flags, internalState);
  }
}


module.exports = {
  condities
};
