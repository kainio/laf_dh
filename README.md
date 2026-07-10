# Arabic Lafd

Experiments in decomposing Arabic script into fixed-shape "syllable blocks" (inspired by Hangul block composition), plus a Latin-transliteration counterpart. Everything is static HTML/JS/Vue 3 (via CDN) — no build step.

- 1D version: in draft phase
- 2D version: in experiment phase

## Pages

| File | What it is |
|---|---|
| [index.html](index.html) | Static comparison of the two custom Kufi fonts (Font 1 / Font 2) on sample Arabic sentences, names, and words. No interactivity. |
| [arabic-blocks.html](arabic-blocks.html) | Original demo: all 7 block shapes shown at once, editable single-letter cells, per-block font toggle, floating virtual Arabic keyboard. Self-contained (does not use `block-library.js`). |
| [arabic-blocks-v2.html](arabic-blocks-v2.html) | Same fixed 7-shape display as v1, refactored to use the shared `SyllableBlock` component from `block-library.js`, with a single global font toggle instead of per-block. |
| [hanarabiya-compositor.html](hanarabiya-compositor.html) | "Hanarabiya" (Han, as in Hangeul, + arabiya) — interactive builder for composing an arbitrary sequence of Arabic syllable blocks (RTL). See **Compositor features** below. |
| [romarabiya-compositor.html](romarabiya-compositor.html) | "Romarabiya" — the same composition workflow, but for Arabic-to-Latin transliteration (LTR). Cells hold Latin strings (e.g. `th`, `kh`, `sh`) instead of single Arabic glyphs. |

## Shared library

[block-library.js](block-library.js) exports `window.ArabicBlockLibrary`, used by the v2 page and both compositors:

- **`shapes`** — 7 block layouts: single cell, side-by-side (2), 2×2 with 3 or 4 cells, top-span (3), and 2×3 with 5 or 6 cells.
- **`arabicLetters`** — the 28-letter Arabic alphabet plus sukun (ـْ), used by the Arabic keyboard.
- **`SyllableBlock`** — editable block component: contenteditable cells, per-cell font-size override, arrow-key/RTL-aware cell navigation, reset button, and a `disableNativeKeyboard` prop that suppresses the mobile OS keyboard so input only comes from the app's own virtual keyboard.
- **`SyllableBlockPreview`** — read-only render of a block, used for the compact live preview.

## Compositor features

Both `hanarabiya-compositor.html` and `romarabiya-compositor.html` (Arabic RTL and Romarabiya LTR respectively) share the same feature set:

- **Composition surface** — click "+" to open a shape picker and insert a block at that position; blocks can be inserted at the start, end, or between existing blocks, and removed individually.
- **Live preview panel** — a read-only, compact rendering of the full composed sequence, updated as you type.
- **Layout orientation** — Horizontal or Vertical composition, with the builder and preview shown side-by-side in vertical mode.
- **Cell font size** — three modes:
  - *Default* — fixed CSS font size.
  - *Auto (fit to cell)* — scales down proportionally for multi-cell shapes and narrower screens.
  - *Edge (fill cell)* — letters fill the cell edge-to-edge (no padding/margin), sized off the real cell dimensions with a safety margin so descenders (e.g. م، ن، ي) aren't clipped.
- **Borders toggle** — show or hide the block/cell outlines without affecting layout or spacing.
- **Mobile keyboard mode** — *Native* (default) or *Virtual only*, which disables native text editing (`contenteditable`/`inputmode`) so mobile browsers never pop up their on-screen keyboard, forcing input through the app's own virtual keyboard.
- **Virtual keyboard** — a floating tooltip near the focused cell:
  - Arabic compositor: the 28-letter alphabet + sukun.
  - Romarabiya: a full transliteration keyboard (a, ä, b, t, th, j, ḥ, kh, d, dh, r, z, s, sh, ṣ, ḍ, ṭ, ṭh, â, gh, f, q, k, l, m, n, h, w, y, g, v, i, o, e, u), and inserting a letter auto-advances focus to the next cell.
- **Refresh button** — reloads the page.
- Positioning of the shape picker and virtual keyboard is viewport-aware: it stays within screen bounds and reflows correctly at any width, including on narrow/mobile screens.

## Assets

- `NotoKufiArabic-Regular.ttf` / `NotoKufiArabic-Regular2.ttf` — the two custom Kufi fonts used throughout ("Font 1" / "Font 2").
- `Korean-Syllable-Blocks.png` — reference image for the Hangul-style block composition this project is inspired by.

## Running locally

Any static file server works, e.g.:

```
python -m http.server
```

Then open `hanarabiya-compositor.html` or `romarabiya-compositor.html` in a browser.

## Sources

- Korean blocks illustration: [Source](https://learnkorean24.com/learn-the-korean-alphabet/)
