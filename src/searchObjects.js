import { ESCAPE_SEQUENCE } from "./constants.js";
import chalk from "chalk";

export async function getQueryIndex(arrayRef) {
  const len = arrayRef.length;
  const indexRef = new Array(len);

  for (let j = 0; j < len; ++j) {
    indexRef[j] = new String();
  }

  for (let j = 0; j < len; ++j) {
    let obj = arrayRef[j];

    if (typeof obj.inhoud === "string") {
      indexRef[j] += obj.inhoud.toLowerCase();
    }

    if (typeof obj.omschrijving === "string") {
      indexRef[j] += " " + obj.omschrijving.toLowerCase();
    }

    if (typeof obj.notities === "string") {
      indexRef[j] += " " + obj.notities.toLowerCase();
    }
  }

  const chosenQuery = await runningQuery(arrayRef, indexRef);

  return chosenQuery;
}

async function runningQuery(arrayRef, indexRef) {
  return new Promise((resolve) => {
    process.stdin.setEncoding("utf8");
    process.stdin.setRawMode(true);

    let query = "";
    repaint(query, arrayRef, indexRef);

    const onData = async (data) => {
      switch (data) {
        case "\u0003":
          process.exit();
        case "\u007f":
          query = repaint(query.slice(0, -1), arrayRef, indexRef); break;
        case "\r":
          process.stdin.removeListener("data", onData);
          process.stdin.setRawMode(false);
          resolve(getIndices(query, indexRef)); break;
        default:
          query = repaint(query + data, arrayRef, indexRef); break;
      }
    }

    process.stdin.on("data", onData);
  });
}

const HEADER = ESCAPE_SEQUENCE.CLEAR_TERM +
  `Je bent nu in zoek mode. Dit betekent dat je tekst kan blijven typen totdat
je het correcte label in beeld ziet. Druk dan op enter en vul bij de volgende
vraag het getal in van het regel object wat je wil wijzigen.
`;

const ROW_OFFSET = 7; // specific for this function and header
const COL_OFFSET = 8;

function repaint(query, arrayRef, indexRef) {
  process.stdout.write(HEADER);
  process.stdout.write("Je zoekterm: ");
  console.log(chalk.green(query));
  paintOptions(query.toLowerCase(), arrayRef, indexRef);
  return query;
}

function getIndices(query, indexRef) {
  const result = [];
  for (let i = 0; i < indexRef.length; i++) {
    if (indexRef[i].indexOf(query.toLowerCase()) > -1) {
      result.push(i);
    }
  }
  return result;
}

function paintOptions(query, arrayRef, indexRef) {
  let rows = process.stdout.rows - ROW_OFFSET;
  let cols = process.stdout.columns - COL_OFFSET;
  let nrows = 0;
  let truncated = false;
  for (let i = 0; i < arrayRef.length; i++) {
    if (nrows > rows) {
      truncated = true;
      break;
    }

    let str = JSON.stringify(arrayRef[i]).slice(0, cols);

    if ((indexRef[i].indexOf(query) > -1)
      || (query.length === 0)) {
      ++nrows;
      process.stdout.write(i + ": " + str + "\n");
    }
  }

  if (truncated) {
    process.stdout.write("...meer regels zijn verborgen...");
  }
}
