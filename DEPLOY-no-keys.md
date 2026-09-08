# Deploying without any API keys

Use **`Hero Payment Links.dc.html`**. It needs no environment variables, no serverless functions, and no Vercel Pro — it is a static page. Nothing secret exists in the code.

## 1. Create three payment links in Stripe (once)

Stripe Dashboard → turn **Test mode** on → **Product catalog → Payment links → New**.

Make one link per price, because your curses have three prices:

| Link | Price | Product name suggestion |
|---|---|---|
| 1 | $3.99 | A Curse — $3.99 |
| 2 | $4.49 | A Curse — $4.49 |
| 3 | $4.99 | A Curse (or your own words) — $4.99 |

For each link, before saving:

- **After payment** → *Don't show confirmation page* → **Redirect to your website**, URL:
  `https://YOUR-SITE.vercel.app/?curse=paid`
  (that query is what makes your "Curse successfully sent." screen appear)
- Optional: turn on **Collect customer email** if you want receipts.

Copy each link — they look like `https://buy.stripe.com/test_xxxxxxxx`.

## 2. Paste the links into the design

Open `Hero Payment Links.dc.html` → **Tweaks** panel → *Stripe payment links* → paste into `link399`, `link449`, `link499`. That's it — no keys, ever.

Until they're filled in, the Pay button just shows the success screen so you can review the flow.

## 3. Deploy

Drag the project folder onto vercel.com/new, or:

```
npm i -g vercel
vercel --prod
```

Point `vercel.json` → `rewrites` → `/` at `Hero Payment Links.dc.html` if you want this to be the homepage.

## 4. Test

Pick a curse, hit Pay, and use test card `4242 4242 4242 4242` (any future expiry / CVC). You land back on the site and see "Curse successfully sent."

The victim's name rides along as Stripe's `client_reference_id`, so each payment in your Stripe Payments list shows which curse and who it was for.

## Going live

Recreate the three links with **Test mode off** and paste the live URLs into the same three tweaks.

## What you give up vs. the other versions

- Payment happens on Stripe's page, not embedded in yours (same as the hosted Checkout version).
- The success screen trusts the `?curse=paid` redirect instead of verifying with Stripe, because verification requires a secret key. Someone could open that URL directly and see the confirmation screen — they just wouldn't have paid, and you'd see no payment in Stripe. If that matters, use `Hero Checkout.dc.html` with the env vars (still free on Hobby — Environment Variables ≠ Custom Environments).
