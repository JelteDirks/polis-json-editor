const { navigate } = require("./handlers/navigate.js");
const { insert } = require("./handlers/insert.js");
const { cache } = require("./handlers/cache.js");
const { saveToFile } = require("./handlers/saveToFile.js");
const { condities } = require("./handlers/condities.js");

const stateLibrary = [
  {
    id: 1,
    handler: navigate
  },
  {
    id: 2,
    handler: insert
  },
  {
    id: 3,
    handler: condities
  },
  {
    id: 4,
    handler: cache
  },
  {
    id: 5,
    handler: saveToFile
  }
];

function nextHandler(id) {
  for (let i = 0; i < stateLibrary.length; i++) {
    if (stateLibrary[i].id === id) {
      return stateLibrary[i];
    }
  }

  console.error("geen state met id:", id);
  process.exit(22);
}

module.exports = {
  nextHandler: nextHandler
};
