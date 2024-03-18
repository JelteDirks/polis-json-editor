const { navigate } = require("./handlers/navigate.js");
const { insert } = require("./handlers/insert.js");
const { cache } = require("./handlers/cache.js");
const { saveToFile } = require("./handlers/saveToFile.js");
const { condities } = require("./handlers/condities.js");
const { HANDLERS } = require("./constants.js");
const { chooseMode } = require("./handlers/chooseMode.js");
const { navigateEdit } = require("./handlers/navigateEdit.js");


const stateLibrary = [
  {
    id: HANDLERS.NAVIGATE_INSERT,
    handler: navigate
  },
  {
    id: HANDLERS.INSERT,
    handler: insert
  },
  {
    id: HANDLERS.CONDITIES,
    handler: condities
  },
  {
    id: HANDLERS.CACHE,
    handler: cache
  },
  {
    id: HANDLERS.SAVETOFILE,
    handler: saveToFile
  },
  {
    id: HANDLERS.CHOOSE_MODE,
    handler: chooseMode
  },
  {
    id: HANDLERS.NAVIGATE_EDIT,
    handler: navigateEdit
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
