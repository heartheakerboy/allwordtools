import { useEffect, useState } from "react";

/**
 * Loads the shared English word list (ENABLE, ~168k words) from the static
 * asset in /public and caches it in-memory for the session. Runs only on the
 * client — the tool is interactive, so there is no SSR data dependency.
 */

let cache: Set<string> | null = null;
let inflight: Promise<Set<string>> | null = null;

async function loadDictionary(): Promise<Set<string>> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = fetch("/dictionaries/enable.txt")
    .then((r) => {
      if (!r.ok) throw new Error(`Dictionary failed to load (${r.status})`);
      return r.text();
    })
    .then((text) => {
      const set = new Set(
        text
          .split("\n")
          .map((w) => w.trim().toLowerCase())
          .filter(Boolean),
      );
      cache = set;
      inflight = null;
      return set;
    })
    .catch((err) => {
      inflight = null;
      throw err;
    });
  return inflight;
}

export type DictionaryState = {
  words: Set<string> | null;
  loading: boolean;
  error: string | null;
};

export function useDictionary(): DictionaryState {
  const [state, setState] = useState<DictionaryState>({
    words: cache,
    loading: !cache,
    error: null,
  });

  useEffect(() => {
    if (cache) {
      setState({ words: cache, loading: false, error: null });
      return;
    }
    let active = true;
    loadDictionary()
      .then((words) => active && setState({ words, loading: false, error: null }))
      .catch(
        (err) =>
          active &&
          setState({ words: null, loading: false, error: err.message ?? "Failed to load" }),
      );
    return () => {
      active = false;
    };
  }, []);

  return state;
}
