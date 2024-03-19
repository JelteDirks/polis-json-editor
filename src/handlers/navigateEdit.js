const { HANDLERS, ESCAPE_SEQUENCE } = require("../constants");

async function navigateEdit(internalState) {
  const len = internalState.JSONObject.regels.length;
  const indexing = new Array(len);

  for (let j = 0; j < len; ++j) {
    indexing[j] = new String();
  }

  for (let j = 0; j < len; ++j) {
    let obj = internalState.JSONObject.regels[j];

    if (typeof obj.inhoud === "string") {
      indexing[j] += obj.inhoud;
    }

    if (typeof obj.omschrijving === "string") {
      indexing[j] += " " + obj.omschrijving;
    }
  }

  Object.assign(internalState, {
    query: {
      indexing: indexing,
      len: len,
      results: []
    }
  });

  const result = await runningQuery(internalState);

  return HANDLERS.CHOOSE_MODE;
}

async function runningQuery(internalState) {
  return new Promise((resolve) => {
    process.stdin.setEncoding("utf8");
    process.stdin.setRawMode(true);

    let query = "";
    repaint(query, internalState);

    const onData = async (data) => {
      switch (data) {
        case "\u0003":
          process.exit(); break;
        case "\u007f":
          query = repaint(query.slice(0, -1), internalState); break;
        case "\r":
          console.log("enter pressed");
          process.stdin.removeListener("data", onData);
          process.stdin.setRawMode(false);
          process.nextTick(() => resolve(query));
          break;
        default:
          query = repaint(query + data, internalState);
          break;
      }
    }

    process.stdin.on("data", onData);
  });
}

const HEADER = ESCAPE_SEQUENCE.CLEAR_TERM +
  `Je bent nu in zoek mode. Dit betekent dat je tekst kan blijven typen totdat
je het correct label in beeld ziet. Druk dan op enter en vul bij de volgende
vraag het getal in van het regel object wat je wil wijzigen.
`;

const ROW_OFFSET = 7; // specific for this function and header
const COL_OFFSET = 8;

function repaint(query, internalState) {
  process.stdout.write(HEADER);
  process.stdout.write(query + "\n\n");

  paintOptions(query, internalState);

  return query;
}

function paintOptions(query, internalState) {
  let rows = process.stdout.rows - ROW_OFFSET;
  let cols = process.stdout.columns - COL_OFFSET;
  let nrows = 0;
  let truncated = false;
  for (let i = 0; i < internalState.query.len; i++) {
    if (nrows > rows) {
      truncated = true;
      break;
    }

    let str = JSON.stringify(internalState.JSONObject.regels[i]).slice(0, cols);

    if ((internalState.query.indexing[i].indexOf(query) > -1)
      || (query.length === 0)) {
      ++nrows;
      process.stdout.write(i + ": " + str + "\n");
    }
  }

  if (truncated) {
    process.stdout.write("...meer regels zijn verborgen...");
  }
}

module.exports = { navigateEdit };
