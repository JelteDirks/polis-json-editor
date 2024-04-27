export const ERRNO = {
  BADCOND: 1,
};

export const DIRECTION = {
  BEFORE: 0,
  AFTER: 1,
};

export const ESCAPE_SEQUENCE = {
  CLEAR_TERM: "\x1Bc"
};

export const REGEL_SOORTEN = {
  "Standaard": 1,
  "Bedrag": 2,
  "Tekst": 3,
  "BedragMetAchtervoegsel": 4,
  "StandaardMetAchtervoegsel": 5,
  "Tabel": 6,
  "Template": 7,
  "Header": 8,
  "Spacer": 9
};

export const SOORT_LOOKUP = {};

Object.keys(REGEL_SOORTEN).forEach(key => {
  SOORT_LOOKUP[REGEL_SOORTEN[key]] = key;
});

export const HANDLERS = {
  NAVIGATE_INSERT: 1,
  INSERT: 2,
  CONDITIES: 3,
  CACHE: 4,
  SAVETOFILE: 5,
  CHOOSE_MODE: 6,
  NAVIGATE_EDIT: 7,
  DELETE_MODE: 8,
  EDIT_QUEUED: 9,
};
