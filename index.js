#!/opt/homebrew/bin/node

const fs = require("node:fs");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");

const argv = yargs(hideBin(process.argv))
  .command("edit <file>", "Wijzig het opgegeven bestand.", (yargs) => {
    yargs.positional("file", {
      describe: "Het JSON bestand dat gewijzigd moet worden",
      type: "string"
    });
  })
  .option("verbose", {
    alias: "v",
    type: "boolean",
    describe: "Geef uitgebreide logging weer"
  })
  .demandCommand(1, "Je moet 1 van de bovenstaande commands opgeven op de tool te kunnen gebruiken")
  .argv;

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

const fileBuffer = require(resolvedFile);

console.dir(fileBuffer.regels.length);
