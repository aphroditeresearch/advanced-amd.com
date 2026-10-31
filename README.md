# 00 Cleared

Members-only landing page for the 00 Cleared mentorship.

The page loads straight into a full-screen scene (looping video, rose strip, the `00 cleared` wordmark slamming in, a laser line) with a Discord sign-in card. "Continue with Discord" opens a balance-clearing popup, then a sample member portal with chapters and lessons.

It's a single static page: plain HTML, CSS and JavaScript, no build step and no dependencies. Fonts load from Google Fonts.

## Run it locally

Open `index.html` in Chrome. Or serve the folder so the video loads the same way it will online:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Files

```
index.html          the whole page
face.mp4, poster.jpg, roses.jpg, favicon.svg
api/                Discord sign-in (Vercel functions)
package.json        tells Vercel which Node version to use
```

Keep the `api` folder as a folder in the repo. If you upload through GitHub's website, drag the whole `api` folder onto the upload page so it isn't flattened.

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

Sign-in runs on small Vercel functions in the `api` folder. No bot is needed.

| Route | What it does |
|---|---|
| `/api/login` | Sends the member to Discord to approve sign-in |
| `/api/callback` | Discord sends them back here. Checks they're in your server, reads their profile and roles, starts a 7-day session |
| `/api/session` | Tells the page who's signed in, their roles and saved progress. Re-checks roles with Discord every 5 minutes |
| `/api/progress` | Saves lesson, breakdown and homework completions with the date (needs the optional database) |
| `/api/logout` | Signs out |

### Setup

1. **Create the Discord app.** Go to https://discord.com/developers/applications → **New Application** → name it "00 Cleared". Open **OAuth2**:
   - Copy the **Client ID**, then **Reset Secret** and copy the **Client Secret**.
   - Under **Redirects**, add `https://www.advanced-amd.com/api/callback` and save. (Add your `*.vercel.app` address too if you test there.)
2. **Copy IDs from Discord.** Turn on User Settings → Advanced → **Developer Mode**. Right-click your server icon → **Copy Server ID**. In Server Settings → Roles, right-click the Chapter 2 and Chapter 3 roles → **Copy Role ID**, and paste them into `ROLES` in `index.html`.
3. **Add environment variables in Vercel** (Project → Settings → Environment Variables), then redeploy:

   | Name | Value |
   |---|---|
   | `DISCORD_CLIENT_ID` | from step 1 |
   | `DISCORD_CLIENT_SECRET` | from step 1 (keep it secret) |
   | `DISCORD_GUILD_ID` | your Server ID |
   | `SESSION_SECRET` | a long random string, e.g. from https://generate-secret.vercel.app/64 |
   | `MEMBER_ROLE_ID` | optional: only members with this role can sign in at all |
   | `DISCORD_REDIRECT_URI` | optional: set it if sign-in says the redirect is invalid, to exactly the URL from step 1 |

4. **Optional, for progress across devices:** in Vercel → **Storage** (or Marketplace) → add **Upstash Redis** and connect it to this project. It adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically. Without it, sign-in and roles still work, and progress stays in each member's browser.

### What members see

- "Continue with Discord" → Discord's approval screen (first time only) → back to the site, the stamp plays, and the portal opens with their name, avatar, banner, join date and Discord ID.
- Chapters unlock from their Discord roles. Give or remove a role in Discord and the site follows within about 5 minutes.
- Not in your server, missing the base role, or cancelled: they land back on the sign-in page with a short message saying why.

The watch-to-complete check runs in the browser, so treat it as a strong nudge rather than proof. For airtight tracking, confirm watch time from your video host before saving a completion. Completion dates are stamped with the server's clock, so they can't be backdated.

## Chrome only and lockdown

- Any browser other than Google Chrome (Safari, Edge, Brave, Firefox, Opera and so on) gets a "Wrong browser" screen with a Get Google Chrome button and a Copy link button. Chrome on iPhone and iPad is allowed. `/api/login` also turns non-Chrome browsers away.
- Right-click, dragging, text selection, copy, printing, Save Page, View Source and the developer-tools shortcuts (F12, Ctrl/Cmd+Shift+I/J/C, Cmd+Option+I/J/C/U) are blocked.
- If developer tools are opened docked to the window, the page covers itself and pauses video until they're closed.
- Lesson videos have download, picture-in-picture, casting and playback-speed controls turned off.

These stop casual copying, but nothing running in a browser can stop someone determined (screen recording, a browser that lies about itself, devtools opened in a separate window). The real protection for lesson videos is on the server: host them on a service with signed, expiring links (Mux, Cloudflare Stream, Bunny Stream or private Vimeo) and have the backend hand out a link only to members whose role allows that chapter.

## Asset rights

The background video and rose artwork come from third-party wallpaper sources. Confirm you have the right to use them commercially, or swap in your own, before the site goes public.
