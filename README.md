# Chee Jia Yun: personal website

My corner of the internet: a minimal, scrapbook-style personal site built with
[Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com) and
[Motion](https://motion.dev).

## Run it on your computer (Mac or Windows)

1. Install [Node.js](https://nodejs.org) (the "LTS" version).
2. Open a terminal in this folder:
   - **Windows:** right-click the folder in File Explorer → **Open in Terminal**.
   - **Mac:** open Terminal, type `cd ` (with a space), drag this folder into the
     window, and press Enter.
3. Run this once, to download everything the site needs:

   ```bash
   npm install
   ```

4. Then start the site:

   ```bash
   npm run dev
   ```

5. Open <http://localhost:3000>. The page updates every time you save a file.

## Change your content

Almost everything lives in the `data/` folder, so you rarely need to touch the
design code:

| File | What it controls |
| --- | --- |
| `data/site.ts` | Name, email, LinkedIn, the "right now" status, your About photo |
| `data/timeline.ts` | The "story so far" timeline in About |
| `data/travel.ts` | Every place on the map, plus its photo and story |
| `data/fitness.ts` | Your PBs and the bench-press estimate |
| `data/experience.ts` | Internships (company, role, dates) |
| `data/projects.ts` | Project Kaya and any future projects |
| `data/volunteering.ts` | Volunteering |
| `data/skills.ts`, `data/education.ts` | Skills and education |

Photos and videos go in the `public/` folder. For example, save a photo as
`public/images/travel/tokyo.jpg`, then use `"/images/travel/tokyo.jpg"` in
`data/travel.ts`.

## Put it online with GitHub Pages (free)

Your site will live at `https://<your-username>.github.io`.

1. **Make a GitHub account** at <https://github.com/signup> and note your username.
2. **Install GitHub Desktop** from <https://desktop.github.com> and sign in with that account.
3. In GitHub Desktop, choose **File → Add Local Repository…**, pick this project
   folder (wherever you saved it) and click **Add Repository**.
4. Click **Publish repository**. Name it **exactly** `<your-username>.github.io`
   (for example `jiayunchee.github.io`), **untick** "Keep this code private", and
   click **Publish Repository**.
5. On <https://github.com>, open the new repository and go to
   **Settings → Pages**. Under **Build and deployment → Source**, choose
   **GitHub Actions**.
6. Open the **Actions** tab, click **Deploy to GitHub Pages**, then
   **Run workflow → Run workflow**. After about 2 minutes you'll see a green tick.
   (A red cross on the very first automatic run is normal: Pages wasn't switched
   on yet.)
7. Visit `https://<your-username>.github.io`. That's your live site.

### Updating the live site

Edit anything, then in GitHub Desktop write a short summary, click
**Commit to main**, then **Push origin**. The site rebuilds itself in about
2 minutes.

### Good to know

- The repository is public, so the code, your photo and the Kaya video are
  visible on GitHub (they're on the website anyway). No phone number is
  stored anywhere in the project.
- Using a different repository name (e.g. `jia-yun-website`) puts the site at
  `https://<your-username>.github.io/jia-yun-website`, which needs one extra
  setting (`basePath` in `next.config.ts`) before it works.
- Prefer a `.vercel.app` address instead? Sign in to <https://vercel.com> with
  GitHub, choose **Add New → Project**, import the repository and click
  **Deploy**. No other changes are needed.
