// ⚠️ YOUR STRIPE KEYS — the only file you edit.
//
// This file runs ONLY on the server (Vercel serverless functions). It is never
// sent to the browser, so the secret key is not visible to visitors.
//
// Two rules:
//   1. This file is listed in .gitignore — keep it that way, never commit it.
//      (GitHub's push protection will block a push that contains a real key.)
//   2. If a key ever leaks, roll it in Stripe Dashboard → Developers → API keys.
//
// Get both from: Stripe Dashboard → turn TEST MODE on → Developers → API keys.

const SECRET_KEY = "sk_test_PASTE_YOUR_SECRET_KEY_HERE";
const PUBLISHABLE_KEY = "pk_test_PASTE_YOUR_PUBLISHABLE_KEY_HERE";

// Environment variables win if you ever set them; otherwise the values above are used.
// The placeholders above match the sk_/pk_ shape, so they must be rejected
// explicitly — otherwise Stripe receives a bogus key and fails cryptically.
const isPlaceholder = (k) => /PASTE_YOUR/.test(k);

function secretKey() {
  const k = (process.env.STRIPE_SECRET_KEY || SECRET_KEY || "").trim();
  return /^sk_(test|live)_/.test(k) && !isPlaceholder(k) ? k : "";
}

function publishableKey() {
  const k = (process.env.STRIPE_PUBLISHABLE_KEY || PUBLISHABLE_KEY || "").trim();
  return /^pk_(test|live)_/.test(k) && !isPlaceholder(k) ? k : "";
}

module.exports = { secretKey, publishableKey };
