const crypto = require("crypto");

function generateCode(length = 7) {
  const raw = crypto.randomBytes(8).toString("base64url");
  return raw.slice(0, length);
}

module.exports = { generateCode };
