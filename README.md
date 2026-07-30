# HIRE Score API — CORS Proxy

This is a tiny Vercel project. It sits in front of
`https://hire-score-fawn.vercel.app/api/scores/` and re-serves the same JSON
with `Access-Control-Allow-Origin` headers added, so your dashboard (hosted
on GitHub Pages or anywhere else) can fetch it directly from the browser.

## Deploy — Option A: Vercel CLI (fastest)

1. Install the CLI if you don't have it:
   ```bash
   npm install -g vercel
   ```
2. From inside this folder, log in and deploy:
   ```bash
   cd hire-score-proxy
   vercel login
   vercel --prod
   ```
3. Answer the setup prompts (link to a new project, accept defaults).
4. Vercel prints a URL when it's done, e.g.:
   ```
   https://hire-score-proxy-abcd1234.vercel.app
   ```
5. Test it in your browser:
   ```
   https://hire-score-proxy-abcd1234.vercel.app/api/scores/
   ```
   You should see the same JSON array as the original API.

## Deploy — Option B: GitHub + Vercel dashboard (no CLI)

1. Create a new GitHub repo and push this folder's contents to it.
2. Go to https://vercel.com/new
3. Import that repo. Leave all settings default (no framework preset needed).
4. Click Deploy. Vercel gives you a URL like `https://your-project.vercel.app`.

## After deploying

Copy your deployed URL and update `HIRE_API_BASE` in your dashboard's
`<script>` section:

```javascript
const HIRE_API_BASE = 'https://your-project.vercel.app/api/scores/';
```

(Keep the trailing slash.)

## Locking it down (optional, recommended once it's working)

Right now the proxy allows requests from any origin (`Access-Control-Allow-Origin: *`).
Once you've confirmed your dashboard works, you can restrict it to just your
site by editing `api/scores/[[...path]].js`:

```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://face-prep-campus-cloud.github.io');
```

Then redeploy with `vercel --prod` again.
