const crypto = require("crypto");

// COOKIE_SECRET måste vara 32 bytes i hex (64 tecken)
function getKey() {
  const hex = process.env.COOKIE_SECRET || "";
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error("COOKIE_SECRET must be 64 hex chars (32 bytes).");
  }
  return Buffer.from(hex, "hex");
}

function encryptJson(obj) {
  const key = getKey();
  const iv = crypto.randomBytes(12); // GCM rekommenderar 12 bytes
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const plaintext = Buffer.from(JSON.stringify(obj), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  // format: iv.tag.cipher (base64url)
  return [
    iv.toString("base64url"),
    tag.toString("base64url"),
    ciphertext.toString("base64url")
  ].join(".");
}

function decryptJson(token) {
  const key = getKey();
  const parts = (token || "").split(".");
  if (parts.length !== 3) return null;

  const iv = Buffer.from(parts[0], "base64url");
  const tag = Buffer.from(parts[1], "base64url");
  const ciphertext = Buffer.from(parts[2], "base64url");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(plaintext.toString("utf8"));
}

module.exports = { encryptJson, decryptJson };