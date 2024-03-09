const { navigate } = require("./handlers/navigate.js");
const { insert } = require("./handlers/insert.js");

const stateLibrary = [
  {
    id: 1,
    handler: navigate
  },
  {
    id: 2,
    handler: insert
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
