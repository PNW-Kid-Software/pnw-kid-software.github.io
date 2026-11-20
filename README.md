# PNW Kid Software website

The home page for PNW Kid Software's Seattle learning games: <https://pnw.kids/>.

Plain HTML and CSS, no build step, no cookies, no trackers. The home page has no scripts. The Fredoka font is self-hosted (OFL, see `fonts/`).

- `index.html`: the whole page (hero, the $4.99 deal, the Seattle map and game cards, how we test, the Free Arcade, grown-ups FAQ)
- `style.css`: styles, including dark mode
- `img/games/`: each game's banner (`<game>.jpg`, 800 px wide) and icon (`<game>-icon.png`, 160 px), copied from that game's own website or store art

- `arcade/`: the Free Arcade, little browser games that are free forever (not the $4.99 learning games). Each game is one self-contained page, `arcade/<game>/index.html`, with its script inline. `arcade.css` is the cabinet around the screen and `arcade.js` holds the shared bits (sound, storage, a crisp canvas). The games make no network requests. They keep only a best time and the sound setting in `localStorage`.

To add an arcade game: copy one of the game folders, keep a round short with a real finish, link the full learning game it comes from on the finish screen, then add a cabinet to the Free Arcade section in `index.html` and a footer link.

To add a game: copy its banner and icon into `img/games/`, add a card in `index.html`, add a pin to the map (`viewBox` 500×600, north at the top), and add it to the footer links once it has its own site.

The domain: `pnw.kids` is registered at Porkbun. Its DNS has an ALIAS record for the root and a CNAME for `www`, both pointing at `pnw-kid-software.github.io`. The `CNAME` file here and the custom domain under Settings → Pages tell GitHub to answer for it, with HTTPS enforced. The old github.io address redirects.
