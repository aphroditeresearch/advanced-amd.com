# 00 Cleared

Members-only landing page for the 00 Cleared mentorship.

The page loads straight into a full-screen scene (looping video, rose strip, the `00 cleared` wordmark slamming in, a laser line) with a Discord sign-in card. "Continue with Discord" opens a balance-clearing popup, then a sample member portal with chapters and lessons.

It's a single static page: plain HTML, CSS and JavaScript, no build step and no dependencies. Fonts load from Google Fonts.

## Files

```
index.html    the whole site (markup, styles, script)
face.mp4      looping background video (1600px, ~4 MB, no audio)
poster.jpg    still frame shown while the video loads
roses.jpg     rose strip on the left of the scene
favicon.svg   browser tab icon
```

## Run it locally

Open `index.html` in Chrome. Or serve the folder so the video loads the same way it will online:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Put it on GitHub

```bash
cd cleared-site
git init
git add .
git commit -m "First version of the 00 Cleared site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/cleared-site.git
git push -u origin main
```

## Publish it

Any static host works. Two easy options:

- **GitHub Pages:** in the repo, go to Settings → Pages, set Source to "Deploy from a branch", pick `main` and `/ (root)`, and save. The site appears at `https://YOUR-USERNAME.github.io/cleared-site/`.
- **Vercel or Netlify:** import the repo, leave the build command empty, and set the output directory to the repo root.

To use your own domain (like `00cleared.com`), add it in the host's domain settings and point your DNS at the host as they instruct.

## What's still a demo

- **Discord sign-in isn't connected.** The button plays the popup and opens the sample portal. Real sign-in needs a Discord application (OAuth2) plus a small backend or serverless function that checks the member's role and starts a session. The portal should then load from that session instead of opening for everyone.
- **Terms of sale and Privacy policy** link to `#terms` and `#privacy`. Add real pages before you take payments.
- The small "Demo build" labels on the sign-in card and portal can be removed once the above is real.

## Editing the portal

Everything you edit lives in the **CONFIG** block near the bottom of `index.html`:

- `ROLES`: the Discord role IDs that unlock Chapter 2 and Chapter 3. In Discord, turn on Developer Mode (User Settings → Advanced), then right-click a role in Server Settings → Roles → **Copy Role ID**.
- `CURRICULUM`: chapters and lessons. Chapter 1 is open to every member. A lesson can be a plain title, or `{ title, video, summary }` to show a video and a short description in the player.
- `HOMEWORK`: assignments shown on the Homework tab (`title`, `chapter`, `due`, `details`). There's a commented example to copy.
- `BREAKDOWNS`: posts shown on the Breakdowns tab (`id`, `title`, `date`, `summary`, optional `video` and `link`).

### Completion rules

- **Lessons complete only after the full video is watched.** Only continuous playback counts, skipping ahead past the furthest point watched is blocked on the first watch, and the lesson ticks itself off when the video ends. Members can't tick lessons by hand.
- Breakdowns with a video follow the same rule. Link-only breakdowns and homework are ticked by hand.
- Every completion records the day it happened. The Profile tab lists each completed lesson, breakdown and homework with its date, newest first.
- Progress is kept per Discord user. Until the backend is connected it's stored in that member's browser. In demo mode, lessons without a video play the site's sample clip so you can try the flow.

## Discord sign-in

The page already knows how to talk to a sign-in backend. It calls `GET /api/session` on load:

- `200` with `{ "user": { "id", "username", "displayName", "avatar", "banner", "joinedAt" }, "roles": ["<role id>", ...] }` → signed in. The greeting, profile and chapter locks use this data, and the demo switches disappear.
- `401` → a backend exists but nobody is signed in. "Continue with Discord" sends the member to `/api/login`.
- Anything else (no backend yet) → demo mode with the Access switches.

To keep progress across devices, the backend also handles:

- `POST /api/progress` with `{ "key": "ch1-2", "completedAt": "2026-10-31T21:04:00Z" }` (or `null` to clear) → save it for the signed-in member.
- Include their saved progress in the session response as `"progress": { "ch1-2": "2026-10-31T21:04:00Z", ... }`.

The watch check runs in the browser, so treat it as a strong nudge rather than proof. If you need it airtight, have the backend record watch time from the video host (most hosts report play progress) and only accept completions it can confirm.

After Discord sends the member back, redirect them to `/?signedin=1` and the page plays the stamp and opens the portal. "Sign out" goes to `/api/logout`.

The backend needs four routes (Vercel serverless functions work well here): `/api/login`, `/api/callback`, `/api/session` and `/api/logout`, using Discord OAuth2 with the `identify` and `guilds.members.read` scopes.

Locking on the page only controls what members see. Serve lesson videos through the backend with links checked against the same roles, so a locked video can't be opened by someone who copies its address.

## Asset rights

The background video and rose artwork come from third-party wallpaper sources. Confirm you have the right to use them commercially, or swap in your own, before the site goes public.
