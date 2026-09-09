// Template. Copy to api/_keys.js and paste your real keys there.
// api/_keys.js is gitignored so it never reaches GitHub.
//
//   cp api/_keys.example.js api/_keys.js

const SECRET_KEY = "sk_test_PASTE_YOUR_SECRET_KEY_HERE";
const PUBLISHABLE_KEY = "pk_test_PASTE_YOUR_PUBLISHABLE_KEY_HERE";

function secretKey() {
  const k = process.env.STRIPE_SECRET_KEY || SECRET_KEY;
  return /^sk_(test|live)_/.test(k) ? k : "";
}

function publishableKey() {
  const k = process.env.STRIPE_PUBLISHABLE_KEY || PUBLISHABLE_KEY;
  return /^pk_(test|live)_/.test(k) ? k : "";
}

module.exports = { secretKey, publishableKey };
