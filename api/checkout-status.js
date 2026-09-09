// GET /api/checkout-status?session_id=cs_test_…
// Returns: { paid: boolean, victim, curseText }
//
// The success page never trusts the URL alone — it asks Stripe whether the
// session was actually paid before showing the "curse sent" screen.

const Stripe = require("stripe");
let keys = { secretKey: () => "", publishableKey: () => "" };
try { keys = require("./_keys"); } catch (e) {} // absent when keys live in env vars
const { secretKey, publishableKey } = { secretKey: () => process.env.STRIPE_SECRET_KEY || keys.secretKey(), publishableKey: () => process.env.STRIPE_PUBLISHABLE_KEY || keys.publishableKey() };

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = secretKey();
  if (!secret) return res.status(500).json({ error: "Paste your Stripe secret key into api/_keys.js (or set STRIPE_SECRET_KEY)." });

  const id = String((req.query && req.query.session_id) || "");
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return res.status(400).json({ error: "Bad session id." });

  try {
    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
    const s = await stripe.checkout.sessions.retrieve(id);
    const meta = s.metadata || {};
    return res.status(200).json({
      paid: s.payment_status === "paid",
      victim: meta.victim || "",
      curseText: meta.curse_text || ""
    });
  } catch (err) {
    console.error("checkout-status:", err && err.message);
    return res.status(502).json({ error: "Could not read the checkout session." });
  }
};
