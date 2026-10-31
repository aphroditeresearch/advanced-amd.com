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

## Chapters and Discord roles

The curriculum lives in the `CURRICULUM` array near the bottom of `index.html`:

| Chapter | Lessons | Who can open it |
|---|---|---|
| Chapter 1 | OHLC / OLHC, AMD, SMT / POI, Break of Structure | Every member |
| Chapter 2 | SMT Divergence, Daily Bias, Key Opens | Members with the Chapter 2 role |
| Chapter 3 | Structural Inducement, Protected Structure | Members with the Chapter 3 role |

To connect it to your server:

1. In Discord, turn on Developer Mode (User Settings → Advanced), then right-click each role in Server Settings → Roles and choose **Copy Role ID**.
2. In `index.html`, paste those IDs into `ROLES.chapter2` and `ROLES.chapter3`.
3. Your sign-in backend (Discord OAuth2 with the `guilds.members.read` scope) reads the member's roles for your server and puts them on the page before the main script runs:

   ```html
   <script>window.CLEARED_SESSION = { roles: ["123456789012345678", "234567890123456789"] };</script>
   ```

   When `CLEARED_SESSION` is present, the portal unlocks chapters from those roles and hides the demo Access switches. When it's absent, the page runs in demo mode and the **Access** switches at the bottom of the portal stand in for the roles.

Locking on the page only controls what members see. Serve the lesson videos through your backend (signed or expiring links checked against the same roles) so a locked video can't be opened by someone who copies its address.

## Asset rights

The background video and rose artwork come from third-party wallpaper sources. Confirm you have the right to use them commercially, or swap in your own, before the site goes public.
