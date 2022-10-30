function getCommandLineArgs() {
  return {};
}

function readVaultConfigs() {
  return {};
}

function readFiles() {
  return {};
}

function searchFiles() {
  return {};
}

function printSearchResults() {
  return {};
}

function handleFlowError() {
  return {};
}

function runFindFlow() {
  return Promise.resolve()
    .then(getCommandLineArgs)
    .then(readVaultConfigs)
    .then(readFiles)
    .then(searchFiles)
    .then(printSearchResults)
    .catch(handleFlowError);
}
