# 00 Cleared

Members-only landing page for the 00 Cleared mentorship.

The page loads straight into a full-screen scene (looping video, rose strip, the `00 cleared` wordmark slamming in, a laser line) with a Discord sign-in card. "Continue with Discord" opens a balance-clearing popup, then a sample member portal with chapters and lessons.

It's a single static page: plain HTML, CSS and JavaScript, no build step and no dependencies. Fonts load from Google Fonts.

## Files

```
index.html          the whole site (markup, styles, script)
assets/face.mp4     looping background video (1600px, ~4 MB, no audio)
assets/poster.jpg   still frame shown while the video loads
assets/roses.jpg    rose strip on the left of the scene
assets/favicon.svg  browser tab icon
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
- **The curriculum is sample data.** Lessons are defined in the `chapters` array near the bottom of `index.html`. Replace them with your real chapters and link each lesson to its player.
- **Terms of sale and Privacy policy** link to `#terms` and `#privacy`. Add real pages before you take payments.
- The small "Demo build" labels on the sign-in card and portal can be removed once the above is real.

## Asset rights

The background video and rose artwork come from third-party wallpaper sources. Confirm you have the right to use them commercially, or swap in your own, before the site goes public.
