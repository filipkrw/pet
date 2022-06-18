const fs = require("fs");

function getReplacer(dict) {
  return function (match, key) {
    return dict[key] || key;
  };
}

function writeFromTemplate(templatePath, targetPath, dict = {}) {
  const replacer = getReplacer(dict);
  const template = fs.readFileSync(templatePath, "utf8");
  const result = template.replace(/\{\{([^}]+)\}\}/g, replacer);
  fs.writeFileSync(targetPath, result, { flag: "w" });
}

module.exports = writeFromTemplate;
