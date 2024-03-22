import { getQueryIndex } from "../searchObjects.js";

export async function deleteMode(internalState) {

  const regelsRef = internalState.JSONObject.regels;
  const chosenQuery = await getQueryIndex(regelsRef);

  console.log(chosenQuery);

  process.exit();
}
