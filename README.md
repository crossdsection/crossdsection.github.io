# Piyush Kumar - Portfolio Website

Modern, single-page portfolio website showcasing professional experience, skills, projects, and achievements.

🌐 **Live Site**: [https://crossdsection.github.io/](https://crossdsection.github.io/)

## Structure

- `index.html`: the whole page (work, journey, stack, AHAM, contact)
- `css/site.css`: all styles
- `js/site.js`: journey toggles, copy-email, header colour switch, Last.fm feed
- `fonts/`: self-hosted woff2 (Big Shoulders Display, Instrument Sans, IBM Plex Mono, Tiro Devanagari Hindi)
- `img/`: portrait and Ummeeed artwork

No build step. Push to `main` and GitHub Pages serves it.

## Things to fill in

Open `js/site.js` and edit the two blocks at the top:

- `LINKS`: Spotify, YouTube, Instagram and Linktree URLs. Empty ones are hidden.
- `LASTFM.apiKey`: a free key from https://www.last.fm/api/account/create turns on the "On my headphones" feed.

The older files (`css/base.css` etc., `js/main.js` etc., `dist/`, `index.prod.html`) are no longer used by the page and can be deleted.
