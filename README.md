# PNW Kid Software website

The home page for PNW Kid Software's Seattle learning games: <https://pnw.kids/>.

Plain HTML and CSS, no build step, no scripts, no cookies, no trackers. The Fredoka font is self-hosted (OFL, see `fonts/`).

- `index.html`: the whole page (hero, the $4.99 deal, the Seattle map and game cards, how we test, grown-ups FAQ)
- `style.css`: styles, including dark mode
- `img/games/`: each game's banner (`<game>.jpg`, 800 px wide) and icon (`<game>-icon.png`, 160 px), copied from that game's own website or store art

To add a game: copy its banner and icon into `img/games/`, add a card in `index.html`, add a pin to the map (`viewBox` 500×600, north at the top), and add it to the footer links once it has its own site.

The domain: `pnw.kids` is registered at Porkbun. Its DNS has an ALIAS record for the root and a CNAME for `www`, both pointing at `pnw-kid-software.github.io`. The `CNAME` file here and the custom domain under Settings → Pages tell GitHub to answer for it, with HTTPS enforced. The old github.io address redirects.
