# Keys, GitHub, and Vercel

GitHub blocked your push because a real Stripe secret key was inside `api/_keys.js`. That protection is correct — a secret key in a repo can be used to charge and refund on your account.

## 1. Rotate the key that was blocked (do this first)

Stripe Dashboard → **Developers → API keys** → your secret key → **⋯ → Roll key**. The old one dies immediately. Any key that has been in a commit, a chat, or a screenshot must be rolled — pushing was blocked, but it may still sit in your local git history.

If you already committed it locally, the simplest clean-up is to delete the local `.git` folder and `git init` fresh (you lose history, not files), or use `git filter-repo`.

## 2. What's set up now

- **`.gitignore`** now excludes `api/_keys.js` and `.env*`. The key file can never be pushed again.
- **`api/_keys.example.js`** is the committed template. On a new machine: `cp api/_keys.example.js api/_keys.js` and paste your keys.
- The endpoints work whether or not `api/_keys.js` exists, and **environment variables always win** over the file.

## 3. Pick the way you deploy

**A. Vercel CLI — keys in the file, still no dashboard config**

```
npm i -g vercel
vercel --prod
```

The CLI normally skips whatever `.gitignore` lists — which would drop your key file. The project now has a **`.vercelignore`**, and when that file exists Vercel uses it instead of `.gitignore`. It does not list `api/_keys.js`, so the key file uploads to the server while staying out of git. Nothing to set in the dashboard.

Verify after deploying: your site's payment form should work. If it says the secret key is missing, the file didn't upload — check that `.vercelignore` exists at the project root.

**B. Connected to GitHub — you must use env vars**

If Vercel builds from your GitHub repo, the gitignored key file never reaches Vercel, so the site will report a missing key. Add them in Vercel → **Settings → Environment Variables**:

| Name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_…` (later `sk_live_…`) |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_…` |

Tick Production / Preview / Development, save, then redeploy. This page is free on the Hobby plan — it is not the "Custom Environments" card that asks for Pro.

## 4. Test before going live

Use **test-mode** keys (`sk_test_…`) and card `4242 4242 4242 4242`, any future expiry and CVC. Confirm your "Curse successfully sent." screen appears and the payment lands in Stripe → Payments. Only then swap in `sk_live_…` / `pk_live_…`.
