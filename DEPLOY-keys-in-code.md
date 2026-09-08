# Deploy with the keys in the code (no Vercel env vars)

Use **`Hero.dc.html`** — the card fields are embedded in your page (Stripe Elements) and the money goes straight into your Stripe account. No payment links, no Pro plan, no environment variables.

## 1. Paste your keys into one file

Open **`api/_keys.js`** and replace the two placeholders:

```js
const SECRET_KEY = "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";        // Stripe → Developers → API keys
const PUBLISHABLE_KEY = "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";
```

Stripe Dashboard → turn **Test mode** ON → Developers → API keys.

That file lives in `/api`, which runs only on Vercel's server — it is never downloaded by visitors, so the secret key is not exposed on your site.

**Two rules:** don't put this project in a public GitHub repo, and if a key ever leaks, roll it in Stripe → Developers → API keys.

## 2. Deploy

Drag the project folder onto [vercel.com/new](https://vercel.com/new), or:

```
npm i -g vercel
vercel --prod
```

Nothing to configure in the Vercel dashboard. Ignore the Custom Environments card entirely.

## 3. Test the payment

Open your site → enter a victim name → pick a curse → fill the card fields with:

- `4242 4242 4242 4242`, any future expiry, any CVC
- decline test: `4000 0000 0000 0002`

On success you get your existing **"Curse successfully sent."** screen, and the payment shows up in Stripe → Payments with the curse and victim in the metadata.

Prices are read from `api/_prices.js` on the server, so nothing in the browser can change what is charged.

## 4. Going live

Swap both values in `api/_keys.js` for your `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` / `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` keys and redeploy.

---

Env vars remain the more standard practice (a leaked repo can't leak what isn't in it). If you ever want to switch, set `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` in Vercel and they automatically take priority over the values in `api/_keys.js` — no code changes.
