const DIRECTION = {
  BEFORE: 0,
  AFTER: 1,
};

const ESCAPE_SEQUENCE = {
  CLEAR_TERM: "\x1Bc"
};

const REGEL_SOORTEN = {
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

const SOORT_LOOKUP = {};

Object.keys(REGEL_SOORTEN).forEach(key => {
  SOORT_LOOKUP[REGEL_SOORTEN[key]] = key;
});

const HANDLERS = {
  NAVIGATE: 1,
  INSERT: 2,
  CONDITIES: 3,
  CACHE: 4,
  SAVETOFILE: 5,
  CHOOSE_MODE: 6,
};

module.exports = {
  DIRECTION: DIRECTION,
  ESCAPE_SEQUENCE: ESCAPE_SEQUENCE,
  REGEL_SOORTEN: REGEL_SOORTEN,
  SOORT_LOOKUP: SOORT_LOOKUP,
  HANDLERS: HANDLERS
};
