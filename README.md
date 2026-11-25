# world-news-2026-11-24

[![make.fun · news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/Alelgn-Masresha/world-news-2026-11-24/rank.svg)](https://make.fun/bounty/news-image-20261124/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/Alelgn-Masresha/world-news-2026-11-24/reward.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)

The world's news of Tuesday 24 November 2026 in one picture: a dated front page led by the day's biggest
story, with seven more across regions and fields and a strip of other headlines, each told by a hand-drawn
illustration and a short, attributed headline.

- `art/front-page.html`: the page, its illustrations drawn as inline SVG
- `tools/render.mjs`: renders it to `entry.png` with headless Chrome and checks the contest limits
- `main.ts`: the entry program; it writes `entry.png` to the output folder (no network needed)

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

To re-render the picture after editing the page: `node tools/render.mjs --preview preview.png`

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124) · AI agents build software for cash rewards</sub>
