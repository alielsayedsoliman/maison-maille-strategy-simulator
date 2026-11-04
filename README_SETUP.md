# Maison Maille — Private Leaderboard Setup

The simulator is public so participants can complete the four rounds and submit results. The leaderboard is a separate `leaderboard.html` page and requires the administrator's Supabase Auth email/password.

## 1. Keep these files together

Place these files in the same deployed website folder:

- `index.html` — the participant simulator (export/download the latest updated version from the saved Site preview).
- `leaderboard.html` — private administrator leaderboard page.
- `maison_maille_supabase_connector_private.js` — submission-only browser connector used by the simulator.

The updated simulator loads the connector from `./maison_maille_supabase_connector.js`. Either rename the downloaded connector file to that exact name, or change the script filename in `index.html` to `maison_maille_supabase_connector_private.js`.

## 2. Configure the public simulator connector

In `maison_maille_supabase_connector_private.js`, replace:

- `YOUR_SUPABASE_PROJECT_URL` with the Supabase Project URL.
- `YOUR_SUPABASE_PUBLISHABLE_KEY` with the `sb_publishable_...` key (or legacy anon/public key if that is what your project uses).

The simulator connector intentionally exposes only `submit()`. It has no public leaderboard read method.

## 3. Create the administrator account

In Supabase Dashboard:

1. Open **Authentication → Users**.
2. Add an administrator user with the email address you will use for the leaderboard.
3. Set a strong password and confirm the user is active.
4. Prefer disabling public sign-ups in **Authentication → Settings**. The SQL policy below still restricts reads to the exact administrator email even if someone else can authenticate.

## 4. Apply the private read policy

Open **SQL Editor** and run `maison_maille_private_leaderboard_policy.sql`.

Before running it, replace `REPLACE_WITH_ADMIN_EMAIL` in the SQL with the exact email created in the previous step. The policy revokes anonymous/public SELECT access, then permits SELECT only when the authenticated JWT email matches the configured admin email. It preserves public submissions through `submit_maille_result`.

## 5. Configure `leaderboard.html`

At the bottom of `leaderboard.html`, replace:

- `YOUR_SUPABASE_PROJECT_URL`
- `YOUR_SUPABASE_PUBLISHABLE_KEY`
- `YOUR_ADMIN_EMAIL@example.com`

Use the same project URL, publishable key, and administrator email as above. Never use a Supabase secret key or `service_role` key in either HTML or JavaScript file.

## 6. Deploy and test

Deploy all three files in the same folder. The leaderboard URL will be:

`https://YOUR_SITE_DOMAIN/leaderboard.html`

Test all of the following:

- In a private/incognito browser, the simulator can submit a result without signing in.
- Opening `leaderboard.html` requires the administrator email and password.
- A different authenticated email is rejected by the page and cannot read the table due to RLS.
- The designated administrator can see submitted results, refresh the list, search participants, and inspect each result.

**Important:** `noindex` and an obscure URL are not access controls. Privacy comes from Supabase Auth plus the row-level security policy. Keep the SQL policy in place; do not re-enable anonymous SELECT on `simulation_results`.
