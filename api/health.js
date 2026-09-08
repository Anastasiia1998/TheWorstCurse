// GET /api/health — one call that says whether Stripe can work.
// Reports only shapes and modes, never key values.

let keys = { secretKey: () => "", publishableKey: () => "" };
try { keys = require("./_keys"); } catch (e) {}

module.exports = function handler(req, res) {
  const sk = (process.env.STRIPE_SECRET_KEY || keys.secretKey() || "").trim();
  const pk = (process.env.STRIPE_PUBLISHABLE_KEY || keys.publishableKey() || "").trim();

  const mode = (k, p) => (new RegExp("^" + p + "_live_").test(k) ? "live" : new RegExp("^" + p + "_test_").test(k) ? "test" : "missing");
  const skMode = mode(sk, "sk");
  const pkMode = mode(pk, "pk");

  let stripeModule = true;
  try { require("stripe"); } catch (e) { stripeModule = false; }

  const problems = [];
  if (skMode === "missing") problems.push("STRIPE_SECRET_KEY is missing or not a valid sk_ key.");
  if (pkMode === "missing") problems.push("STRIPE_PUBLISHABLE_KEY is missing or not a valid pk_ key.");
  if (skMode !== "missing" && pkMode !== "missing" && skMode !== pkMode)
    problems.push("Key mode mismatch: secret is " + skMode + ", publishable is " + pkMode + ". They must match.");
  if (!stripeModule) problems.push("The 'stripe' package is not installed on the server.");

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    ok: problems.length === 0,
    secretKey: skMode,
    publishableKey: pkMode,
    keySource: process.env.STRIPE_SECRET_KEY ? "environment variable" : sk ? "api/_keys.js" : "none",
    stripePackage: stripeModule,
    problems: problems
  });
};
