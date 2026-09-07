# Deploying theworstcurse.net to Vercel (Stripe Test Mode)

## What's in the project

- `Hero.dc.html` — the site. Card fields are Stripe Elements (Stripe holds the card data; it never touches your server or this page).
- `api/config.js` — `GET /api/config`, hands the browser your **publishable** key from the environment.
- `api/create-payment-intent.js` — `POST /api/create-payment-intent`, creates the PaymentIntent.
- `api/_prices.js` — the server-side price table (all 30 curses + custom at $4.99). The browser only sends a curse id; a price sent by the browser is ignored.
- `vercel.json` — serves `Hero.dc.html` at `/`, no-cache on `/api/*`.
- `package.json` — the `stripe` dependency.

## 1. Get your test keys

Stripe Dashboard → toggle **Test mode** on → Developers → API keys. Copy:

- **Publishable key** — starts `pk_test_…`
- **Secret key** — starts `sk_test_…`

## 2. Deploy

Either drag the project folder onto vercel.com/new, or:

```
npm i -g vercel
vercel        # first deploy (preview)
vercel --prod # production
```

## 3. Add your keys (this is the only place they go)

Vercel Dashboard → your project → **Settings → Environment Variables** → add two:

| Name | Value | Environments |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_…` | Production, Preview, Development |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_…` | Production, Preview, Development |

Then **Deployments → … → Redeploy** (env vars only apply to new builds).

Locally: `vercel env pull .env.local`, then `vercel dev`. Never commit `.env.local`.

## 4. Test the payment

Open the site, enter a victim name, pick a curse, then pay with:

- Card `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.
- Decline test: `4000 0000 0000 0002`.

On success the form swaps to your existing **"Curse successfully sent."** screen. The payment appears in Stripe → Payments with `curse_id`, `curse_text`, and `victim` in the metadata.

## 5. Going live later

Swap both env vars for your `pk_live_…` / `sk_live_…` keys and redeploy. Nothing else changes.

Note: in this design preview there is no `/api`, so the form shows "Stripe is not connected in this preview" and the Cast button jumps straight to the success screen — that is preview-only behavior. On Vercel with keys set, a real test charge is required.
