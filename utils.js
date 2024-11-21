const path = require("path");

function resolvePath(relativePath) {
  return path.join(__dirname, relativePath);
}

module.exports = { resolvePath };
