import { readLocalConfig } from "./config/readLocalConfig.js";

export async function getIsInitialized() {
  try {
    await readLocalConfig();
    return true;
  } catch (e) {
    return false;
  }
}
