// GET /api/config
// Hands the browser the publishable key (safe to expose by design).
// The value comes from api/_keys.js, or from an env var if one is set.

let keys = { secretKey: () => "", publishableKey: () => "" };
try { keys = require("./_keys"); } catch (e) {} // absent when keys live in env vars
const { secretKey, publishableKey } = { secretKey: () => process.env.STRIPE_SECRET_KEY || keys.secretKey(), publishableKey: () => process.env.STRIPE_PUBLISHABLE_KEY || keys.publishableKey() };

module.exports = function handler(req, res) {
  const pk = publishableKey();

  if (pk && !/^pk_/.test(pk)) {
    // Guardrail: refuse to serve anything that is not a publishable key.
    console.error("STRIPE_PUBLISHABLE_KEY does not start with pk_ — refusing to serve it.");
    return res.status(500).json({ error: "Server key misconfigured." });
  }

  // Diagnostic: a live secret + test publishable (or vice versa) is the most
  // common "could not start the payment" cause. Only the modes are exposed.
  const sk = (secretKey() || "").trim();
  const pkMode = /^pk_live_/.test(pk) ? "live" : pk ? "test" : "missing";
  const skMode = /^sk_live_/.test(sk) ? "live" : /^sk_test_/.test(sk) ? "test" : "missing";

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    publishableKey: pk,
    mode: pkMode,
    secretMode: skMode,
    mismatch: pkMode !== skMode
  });
};
