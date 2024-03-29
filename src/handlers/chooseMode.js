import { HANDLERS } from "../constants.js";
import { clearView, readOne } from "../lib.js";
import chalk from "chalk";

const red = chalk.red;
const yellow = chalk.yellow;
const green = chalk.green;

export async function chooseMode(internalState) {

  clearView()

  process.stdout.write("Je bent het onderstaande bestand aan het aanpassen\n" +
    internalState.argv.file);

  process.stdout.write(green("\ni: Ik wil nieuwe regel objecten toevoegen (insert mode)"));
  process.stdout.write(yellow("\ne: Ik wil een bestaand regel object wijzigen (edit mode)"));
  process.stdout.write(red("\nd: Ik wil bestaande regel objecten verwijderen (delete mode)"));
  process.stdout.write("\nWat wil je doet met het bestand? (default = i)\n");

  const answer = await readOne();

  if (answer.trim() === "i") {
    return HANDLERS.NAVIGATE_INSERT;
  } else if (answer.trim() === "e") {
    return HANDLERS.NAVIGATE_EDIT;
  } else if (answer.trim() === "d") {
    return HANDLERS.DELETE_MODE;
  } else {
    return HANDLERS.CHOOSE_MODE;
  }
}
