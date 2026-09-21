# Are We There Yet? — Project Context

**Repo:** github.com/justanotheraviationgeek1-arch/AreWeThereYet-V.3
**Live site:** awtygames.com (deployed via Vercel, fronted by Cloudflare)
**Owner contact:** james.minikes@gmail.com

## What this is
A family road-trip/plane-mode party-games web app. Free tier + two paid
plans ($5/yr Road Trip Premium, $5/yr Plane Mode, $7/yr Bundle) via
Stripe Checkout.

## Architecture (important — this is not a typical app)
- The entire frontend is ONE file: `index.html` (~4,100 lines). All CSS
  and JS are inline in that file. There is no build step, no bundler,
  no framework, no package.json.
- The only backend code is `api/checkout.js`, a single Vercel serverless
  function that creates a Stripe Checkout session.
- Game content lives in two hardcoded JS arrays inside index.html:
  `GAMES` (~59 objects) and `PLANE_GAMES`.
- All user/account state — email, password, premium flags — is stored
  in the browser via `localStorage` (`awty_accounts`, `awty_session`).
  There is no real backend database or auth system.

## Known issues (flag before "fixing" — may be intentional given the
app's small scale, but should be weighed honestly, not glossed over)
1. **Passwords stored in plaintext** in localStorage and compared with
   `!==` in `submitSignIn`. Anyone with devtools access to a shared
   device can read them. Real risk to users who reuse passwords.
2. **Premium/paywall is entirely client-side and unverified.** The
   `isPremium` / `isPlanePremium` flags gating game content come from
   localStorage and are set either by editing that object directly, or
   by the `?payment=success&plan=...` redirect handler — which trusts
   the URL query string with no server-side check that a Stripe payment
   actually happened. Fixing this properly requires a real backend,
   which is also a prerequisite for the roadmap item "multi-device
   account sync."
3. **index.html gets periodically re-saved from the live (Cloudflare-
   fronted) site** rather than edited as source. This causes real email
   addresses to get replaced by Cloudflare's `__cf_email__` obfuscation
   markup, and has caused the `email-decode.min.js` `<script>` tag to be
   duplicated multiple times in a row. Always edit the repo file
   directly; don't paste content copied from the rendered/served page
   back into the source.

## Style/content conventions to follow when editing
- Marketing/roadmap copy uses vague, undated language ("eventually",
  "Coming Soon") rather than specific future dates that can go stale —
  see the Workshop feature and the Press page "Coming Soon" card as the
  pattern to match.
- Legal docs (Terms of Service, Privacy Policy) keep real effective/
  last-updated dates — do not vague those out.
- Changelog / "What's New" entries on the Press page are past-tense
  records and should keep their real ship dates.
