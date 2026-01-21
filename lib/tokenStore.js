// lib/tokenStore.js
const fs = require("fs");
const path = require("path");

const DATA_DIR = process.env.DATA_DIR || "/data";
const FILE_PATH = path.join(DATA_DIR, "spotify_token.json");

function ensureDir() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {}
}

function readToken() {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function writeToken(tokenObj) {
  ensureDir();
  fs.writeFileSync(FILE_PATH, JSON.stringify(tokenObj, null, 2), "utf8");
}

module.exports = { readToken, writeToken };