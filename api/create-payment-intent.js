// POST /api/create-payment-intent
// Body: { curseId: number | "custom", victim?: string, customText?: string }
// Returns: { clientSecret, amount, currency, label }
//
// The amount is resolved from the server-side table in api/_prices.js.
// A price sent by the browser is ignored entirely.

const Stripe = require("stripe");
const { lookup } = require("./_prices");
let keys = { secretKey: () => "", publishableKey: () => "" };
try { keys = require("./_keys"); } catch (e) {} // absent when keys live in env vars
const { secretKey, publishableKey } = { secretKey: () => process.env.STRIPE_SECRET_KEY || keys.secretKey(), publishableKey: () => process.env.STRIPE_PUBLISHABLE_KEY || keys.publishableKey() };

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = secretKey();
  if (!secret) {
    return res.status(500).json({ error: "Paste your Stripe secret key into api/_keys.js (or set STRIPE_SECRET_KEY)." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const curse = lookup(body.curseId);
  if (!curse) {
    return res.status(400).json({ error: "Unknown curse." });
  }

  // Defensive: the table should only ever hold 399–499, but never charge outside it.
  if (!Number.isInteger(curse.price) || curse.price < 399 || curse.price > 499) {
    return res.status(500).json({ error: "Price table is invalid." });
  }

  const clean = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, "").trim().slice(0, max);
  const victim = clean(body.victim, 80);
  const customText = curse.id === "custom" ? clean(body.customText, 300) : "";

  try {
    const stripe = new Stripe(secret.trim(), { apiVersion: "2024-06-20" });

    const intent = await stripe.paymentIntents.create({
      amount: curse.price,
      currency: "usd",
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      description: "Curse: " + (curse.id === "custom" ? "custom" : curse.text),
      // Metadata only — no card data, ever.
      metadata: {
        curse_id: String(curse.id),
        curse_text: curse.id === "custom" ? customText : curse.text,
        victim: victim
      }
    });

    return res.status(200).json({
      clientSecret: intent.client_secret,
      amount: curse.price,
      currency: "usd",
      label: curse.id === "custom" ? "Custom curse" : curse.text
    });
  } catch (err) {
    // Surface Stripe's own message — these are safe, non-sensitive diagnostics
    // (bad key, live/test mismatch, unactivated account, unsupported method).
    console.error("create-payment-intent:", err && err.type, err && err.message);
    return res.status(502).json({
      error: (err && err.message) || "Could not start the payment.",
      type: (err && err.type) || null,
      code: (err && err.code) || null
    });
  }
};
