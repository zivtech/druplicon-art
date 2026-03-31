# Druplicon Art

An unofficial static art showcase that reinterprets the Druplicon in eight digital styles, including ASCII, SVG, particle systems, glitch rendering, matrix rain, and typographic distortion.

The project is a small Vite + React app with no backend requirements, which makes it a good fit for GitHub Pages.

## What’s Included

- `01` Monochrome ASCII
- `02` Brand Palette ASCII
- `03` Neon Wireframe
- `04` Self-Drawing Line Art
- `05` Particle Cloud
- `06` Code Rain
- `07` Glitch Distortion
- `08` Variable Typography

## Tech Stack

- React 18
- Vite 6
- TypeScript
- Tailwind CSS 4
- Framer Motion

## Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, typically `http://127.0.0.1:5173` or the next available port.

## Production Build

```bash
npm run build
```

The production output is written to `dist/`.

## GitHub Pages

This repo is configured to deploy cleanly to GitHub Pages using GitHub Actions.

How it works:

1. Push to `main`.
2. GitHub Actions builds the app.
3. The generated `dist/` folder is deployed to Pages.

The Vite `base` path is configured automatically for the GitHub repository name during build, so project Pages hosting works without manual asset-path edits.

Expected Pages URL for this repo:

`https://zivtech.github.io/druplicon-art/`

## Repository Notes

- Static site only. No server runtime is required.
- GitHub Pages is the simplest host for this project.
- If you later want previews, forms, serverless functions, or analytics integrations, Vercel or Netlify would be the next obvious step up.

## License

This repository is licensed under the GNU General Public License v3.0. See [LICENSE](./LICENSE).
