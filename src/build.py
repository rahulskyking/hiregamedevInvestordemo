#!/usr/bin/env python3
"""Build a single, fully self-contained HireGameDev workspace HTML file."""
from __future__ import annotations

import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
FONTS = ROOT / "fonts"
OUT = ROOT / "index.html"

JS_FILES = ["data.js", "core.js", "views.js", "views2.js", "flows.js"]


def data_uri(path: Path) -> str:
    return "data:font/woff2;base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def build() -> None:
    font_css = f"""
@font-face {{
  font-family: "Inter";
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url("{data_uri(FONTS / 'inter-latin.woff2')}") format("woff2");
}}
@font-face {{
  font-family: "Space Grotesk";
  font-style: normal;
  font-weight: 300 700;
  font-display: swap;
  src: url("{data_uri(FONTS / 'space-grotesk-latin.woff2')}") format("woff2");
}}
""".strip()

    template = (SRC / "template.html").read_text(encoding="utf-8")
    styles = (SRC / "styles.css").read_text(encoding="utf-8").replace("/*__FONT_CSS__*/", font_css)
    scripts = "\n\n".join((SRC / name).read_text(encoding="utf-8") for name in JS_FILES)

    assert "</style" not in styles.lower(), "Styles contain a closing style tag"
    assert "</script" not in scripts.lower(), "Scripts contain a closing script tag"

    html = template.replace("/*__STYLES__*/", styles).replace("/*__SCRIPTS__*/", scripts)
    OUT.write_text(html, encoding="utf-8")
    print(f"Built {OUT} ({OUT.stat().st_size / 1024:.1f} KiB)")


if __name__ == "__main__":
    build()
