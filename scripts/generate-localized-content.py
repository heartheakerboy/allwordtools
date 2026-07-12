#!/usr/bin/env python3
"""
DeepSeek-powered localized content generator for AllWordTools.

Produces MARKET-NATIVE content (not literal translation) for the priority
tools in each target locale: native meta title/description tuned to local
keywords, native search intent, localized FAQs, intro, how-to steps,
sections, examples and tips — with the English base as reference.

- Reads English base from scripts/.cache/english-base.json
  (run `bun scripts/extract-english-content.ts` first).
- Writes/merges into src/i18n/content/tools/<locale>.json.
- Fully resumable: existing tools in the output are skipped unless --force.

Usage:
  python3 scripts/generate-localized-content.py --locale de
  python3 scripts/generate-localized-content.py --locale de --slug letter-counter --force
  python3 scripts/generate-localized-content.py --all
"""
import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
BASE_FILE = ROOT / "scripts" / ".cache" / "english-base.json"
OUT_DIR = ROOT / "src" / "i18n" / "content" / "tools"

API_URL = "https://api.deepseek.com/chat/completions"
MODEL = "deepseek-chat"

LOCALES = {
    "es": "Spanish (Spain & Latin America)",
    "hi": "Hindi (India)",
    "ar": "Arabic (Modern Standard, MENA)",
    "de": "German (Germany)",
    "pt": "Portuguese (Brazil)",
    "id": "Indonesian (Indonesia)",
    "ru": "Russian (Russia)",
}

# Fields the localized JSON must contain (matches LocalizedToolContent).
FIELDS = [
    "metaTitle", "metaDescription", "searchIntent", "keywords",
    "heading", "subheading", "intro", "howToTitle", "howToSteps",
    "sections", "examples", "tips", "faqs",
]

SYSTEM = (
    "You are a native-speaking SEO content strategist and localization expert. "
    "You do NOT translate word-for-word. You rewrite content so it reads as if "
    "originally written by a native speaker for that market, using the real "
    "search terms local users type, native phrasing, and locally relevant "
    "examples. You always reply with a single valid JSON object and nothing else."
)


def build_prompt(tool: dict, locale_code: str, locale_name: str) -> str:
    base = {k: tool.get(k) for k in [
        "metaTitle", "metaDescription", "heading", "subheading", "intro",
        "howToTitle", "howToSteps", "sections", "examples", "tips", "faqs",
    ]}
    return f"""Target market/language: {locale_name} (locale code: {locale_name!r}, write ONLY in this language).

Tool: {tool['name']} — {tool['description']} (category: {tool['category']}).

Below is the ENGLISH reference content. Create MARKET-NATIVE {locale_name} content
for this tool. Do local keyword research in your head: use the actual words and
phrases native speakers search for (not literal translations of English SEO terms),
match local search intent, and use examples that use real words in {locale_name}.

Return a JSON object with EXACTLY these keys:
- metaTitle: string, < 60 chars, includes the primary local keyword
- metaDescription: string, < 160 chars, compelling, local keyword
- searchIntent: string, one short phrase describing the dominant local search intent
- keywords: array of 6-10 native local keyword strings
- heading: string (H1)
- subheading: string
- intro: array of 2-3 paragraph strings
- howToTitle: string
- howToSteps: array of objects {{title, detail}}
- sections: array of objects {{heading, paragraphs (array of strings)}}
- examples: array of objects {{input, output, note}} using real {locale_name} words
- tips: array of short strings
- faqs: array of objects {{question, answer}} answering real local questions

Match the array lengths of the reference roughly. Do NOT include any other keys.
Do NOT wrap in markdown code fences.

ENGLISH REFERENCE:
{json.dumps(base, ensure_ascii=False, indent=2)}
"""


def call_deepseek(prompt: str, api_key: str, retries: int = 4) -> dict:
    for attempt in range(retries):
        try:
            r = requests.post(
                API_URL,
                headers={"Authorization": f"Bearer {api_key}",
                         "Content-Type": "application/json"},
                json={
                    "model": MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM},
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 1.0,
                    "response_format": {"type": "json_object"},
                    "max_tokens": 8000,
                },
                timeout=180,
            )
            if r.status_code == 429:
                wait = 5 * (attempt + 1)
                print(f"    rate limited, waiting {wait}s", flush=True)
                time.sleep(wait)
                continue
            r.raise_for_status()
            content = r.json()["choices"][0]["message"]["content"]
            return json.loads(content)
        except (requests.RequestException, json.JSONDecodeError, KeyError) as e:
            print(f"    attempt {attempt+1} failed: {e}", flush=True)
            time.sleep(3 * (attempt + 1))
    raise RuntimeError("DeepSeek failed after retries")


def clean(obj: dict) -> dict:
    return {k: obj[k] for k in FIELDS if k in obj}


def load_out(locale: str) -> dict:
    p = OUT_DIR / f"{locale}.json"
    if p.exists():
        return json.loads(p.read_text(encoding="utf-8"))
    return {}


def save_out(locale: str, data: dict):
    p = OUT_DIR / f"{locale}.json"
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def generate_locale(locale: str, base_tools: list, api_key: str,
                    only_slug: str | None, force: bool):
    if locale not in LOCALES:
        print(f"Unknown locale {locale}", file=sys.stderr)
        return
    name = LOCALES[locale]
    out = load_out(locale)
    print(f"== {locale} ({name}) — {len(out)} already present ==", flush=True)
    for tool in base_tools:
        slug = tool["slug"]
        if only_slug and slug != only_slug:
            continue
        if slug in out and not force:
            continue
        print(f"  -> {slug}", flush=True)
        try:
            result = clean(call_deepseek(build_prompt(tool, locale, name), api_key))
            out[slug] = result
            save_out(locale, out)  # save after each tool = resumable
        except Exception as e:
            print(f"     ERROR {slug}: {e}", flush=True)
    print(f"== {locale} done — {len(out)} tools ==", flush=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--locale", help="Single locale code (es, hi, ar, de, pt, id, ru)")
    ap.add_argument("--all", action="store_true", help="All locales")
    ap.add_argument("--slug", help="Only this tool slug")
    ap.add_argument("--force", action="store_true", help="Regenerate even if present")
    args = ap.parse_args()

    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        sys.exit("DEEPSEEK_API_KEY not set")
    if not BASE_FILE.exists():
        sys.exit("Run: bun scripts/extract-english-content.ts  (english-base.json missing)")

    base_tools = json.loads(BASE_FILE.read_text(encoding="utf-8"))

    if args.all:
        targets = list(LOCALES)
    elif args.locale:
        targets = [args.locale]
    else:
        sys.exit("Pass --locale <code> or --all")

    for loc in targets:
        generate_locale(loc, base_tools, api_key, args.slug, args.force)


if __name__ == "__main__":
    main()
