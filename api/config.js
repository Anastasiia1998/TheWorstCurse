// GET /api/config
// Hands the browser the publishable key from the environment, so no key is
// hardcoded in the project's source.

module.exports = function handler(req, res) {
  const pk = process.env.STRIPE_PUBLISHABLE_KEY || "";

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
