// POST /api/create-checkout-session
// Body: { curseId: number | "custom", victim?: string, customText?: string, returnTo?: string }
// Returns: { url }  — the Stripe-hosted Checkout page to redirect to.
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
  if (!curse) return res.status(400).json({ error: "Unknown curse." });
  if (!Number.isInteger(curse.price) || curse.price < 399 || curse.price > 499) {
    return res.status(500).json({ error: "Price table is invalid." });
  }

  const clean = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, "").trim().slice(0, max);
  const victim = clean(body.victim, 80);
  const customText = curse.id === "custom" ? clean(body.customText, 300) : "";

  // Only ever return to our own origin.
  const proto = (req.headers["x-forwarded-proto"] || "https").split(",")[0];
  const host = (req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0];
  const origin = proto + "://" + host;
  let path = clean(body.returnTo, 200) || "/";
  if (!path.startsWith("/")) path = "/";

  try {
    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: curse.price,
          product_data: {
            name: "A curse for " + (victim || "someone who deserves it"),
            description: curse.id === "custom" ? customText || "Custom curse" : curse.text
          }
        }
      }],
      success_url: origin + path + "?curse=paid&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + path + "?curse=cancelled",
      metadata: {
        curse_id: String(curse.id),
        curse_text: curse.id === "custom" ? customText : curse.text,
        victim: victim
      }
    });

    if (!session.url) throw new Error("Stripe returned no Checkout URL.");
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("create-checkout-session:", err && err.message);
    return res.status(502).json({ error: "Could not start the checkout." });
  }
};
