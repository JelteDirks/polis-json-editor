const { clearView, readLine, readOne } = require("../lib");

async function insert(internalState) {

  if (!internalState.insertAt) {
    return 1; // go back to creating insertion point
  }

  clearView();
  const regel = {};

  process.stdout.write("Wat is de omschrijving van de regel?\n");

  const omschrijving = await readLine();

  Object.assign(regel, { omschrijving: omschrijving.trim() });
  clearView()
  showStatus(regel);
  process.stdout.write("\n\nWat is de soort? (default = Standaard)\n");

  const soort = await readLine();

  if (soort.trim().length !== 0) {
    Object.assign(regel, { soort: soort.trim() });
  } else {
    Object.assign(regel, { soort: "Standaard" });
  }

  clearView()
  showStatus(regel);
  process.stdout.write("\n\nWat is de dekking? (default = geen dekking)\n");

  const dekking = await readLine();

  if (dekking.trim().length !== 0) {
    Object.assign(regel, { dekking: dekking.trim() });
  }

  clearView();
  showStatus(regel);
  process.stdout.write("\n\nWat is de inhoud? (default = lege inhoud)\n");

  const inhoud = await readLine();

  if (inhoud.trim().length !== 0) {
    Object.assign(regel, { inhoud: inhoud.trim() });
  }

  clearView();
  showStatus(regel);

  process.stdout.write("\n\nWil je condities toevoegen?\n");

  const answer = await readOne();

  if (answer.trim() === "j") {
    return 3;
  }

  return 4;
}

function showStatus(regel) {
  process.stdout.write("Huidig object: \n");
  process.stdout.write(JSON.stringify(regel, null, 2));
}

module.exports = {
  insert
};
