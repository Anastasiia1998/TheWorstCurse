// GET /api/config
// Hands the browser the publishable key (safe to expose by design).
// The value comes from api/_keys.js, or from an env var if one is set.

const { publishableKey } = require("./_keys");

module.exports = function handler(req, res) {
  const pk = publishableKey();

  if (pk && !/^pk_/.test(pk)) {
    // Guardrail: refuse to serve anything that is not a publishable key.
    console.error("STRIPE_PUBLISHABLE_KEY does not start with pk_ — refusing to serve it.");
    return res.status(500).json({ error: "Server key misconfigured." });
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    publishableKey: pk,
    mode: /^pk_live_/.test(pk) ? "live" : "test"
  });
};
