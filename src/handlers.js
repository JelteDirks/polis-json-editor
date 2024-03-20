import { navigate } from "./handlers/navigate.js";
import { insert } from "./handlers/insert.js";
import { cache } from "./handlers/cache.js";
import { saveToFile } from "./handlers/saveToFile.js";
import { condities } from "./handlers/condities.js";
import { HANDLERS } from "./constants.js";
import { chooseMode } from "./handlers/chooseMode.js";
import { navigateEdit } from "./handlers/navigateEdit.js";
import { editQueued } from "./handlers/editQueued.js";


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
  },
  {
    id: HANDLERS.EDIT_QUEUED,
    handler: editQueued
  }
];

export function nextHandler(id) {
  for (let i = 0; i < stateLibrary.length; i++) {
    if (stateLibrary[i].id === id) {
      return stateLibrary[i];
    }
  }

  console.error("geen state met id:", id);
  process.exit(22);
}
