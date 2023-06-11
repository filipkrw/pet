import { loadCoreConfigs } from "./loadConfigs/loadCoreConfigs.js";

export async function checkIsInitialized() {
  try {
    await loadCoreConfigs();
    return true;
  } catch (e) {
    return false;
  }
}
