#!/opt/homebrew/bin/node

(async () => {
  const fs = require("node:fs");
  const yargs = require("yargs");
  const { hideBin } = require("yargs/helpers");
  const path = require("path");
  const { sleep, nextHandler } = require("./src/lib.js");


  const argv = yargs(hideBin(process.argv))
    .command("edit <file>", "Wijzig het opgegeven bestand.", (yargs) => {
      yargs.positional("file", {
        describe: "Het JSON bestand dat gewijzigd moet worden.",
        type: "string"
      });
      yargs.option("insert-mode", {
        alias: "i",
        type: "boolean",
        describe: "In insert mode kunnen alleen nieuwe JSON regels toegevoegd worden."
      });
      yargs.option("basic-inserts", {
        alias: "b",
        type: "boolean",
        describe: "Met basic inserts kunnen alleen de volgende eigenschappen toegevoegd worden aan een JSON regel: omschrijving, soort, inhoud, dekking, condities. De condities zijn ook gelimiteerd om het process te versnellen."
      });
      yargs.option("sequential", {
        alias: "s",
        type: "boolean",
        describe: "Sequential inserts betekent dan alle JSON regel object in de volgorde toegevoegd worden waarin ze worden opgegeven in de editor."
      });
    })
    .command("create <file>", "Maak een nieuw bestand", (yargs) => {
      yargs.positional("file", {
        describe: "Het pad naar het JSON bestand dat aangemaakt moet worden",
        type: "string"
      });
    })
    .option("verbose", {
      alias: "v",
      type: "boolean",
      describe: "Geef uitgebreide logging weer"
    })
    .demandCommand(1, "Je moet 1 van de bovenstaande commands opgeven op de " +
      "tool te kunnen gebruiken")
    .argv;

  console.dir(argv);

  const resolvedFile = path.resolve(argv.file);

  let fileStats;
  try {
    fileStats = fs.statSync(resolvedFile);
  } catch (error) {
    console.error("Fout tijdens het lezen van het bestand, controleer het bestand");
    console.error(error);
    process.exit(1);
  }

  if (fileStats.isDirectory()) {
    console.error("Het bestand is een directory, controleer het bestand");
    process.exit(2);
  }

  if (!fileStats.isFile()) {
    console.error("Het bestand is geen file, controleer het bestand");
    process.exit(3);
  }

  if (path.extname(resolvedFile).toLowerCase() !== ".json") {
    console.error("Het bestand is geen geldig JSON bestand");
    process.exit(4);
  }

  if ((argv.i & argv.b & argv.s) === 0) {
    console.error("Momenteel is alleen nog een insert-mode, basic-inserts " +
      "en sequential toegestaan, voeg '-ibs' toe aan het commando.");
    process.exit(5);
  }

  const fileBuffer = require(resolvedFile);

  let safety = 10;

  let stateNumber = -1;
  let stateHandler = () => { };
  if ((argv.i & argv.b & argv.s) === 1) {
    ({ internalState: id, handler: stateHandler } = nextHandler(1)); // start with navigation
  }

  while (1) {
    safety--;

    stateNumber = await stateHandler();

    if (safety < 0) {
      console.warn("Safety loop break reached");
      break;
    }
  }

  console.log(JSON.stringify(fileBuffer, null, 2).slice(0, 100));
})();
