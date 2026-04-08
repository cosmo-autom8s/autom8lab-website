const fs = require('fs');
const path = require('path');

function parseEnvFile(contents) {
  contents.split(/\r?\n/).forEach((line) => {
    var trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    var separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) return;

    var key = trimmed.slice(0, separatorIndex).trim();
    var rawValue = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key]) return;

    if (
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
    ) {
      rawValue = rawValue.slice(1, -1);
    }

    process.env[key] = rawValue;
  });
}

function loadEnvFile(filename) {
  var envPath = path.join(process.cwd(), filename);
  if (!fs.existsSync(envPath)) return;
  parseEnvFile(fs.readFileSync(envPath, 'utf8'));
}

loadEnvFile('.env');
loadEnvFile('.env.local');

