/**
 * Cookie consent storage + shared helpers.
 * Choices persist in localStorage; the banner shows only until a choice is made.
 */
export type CookieCategory =
  "essential" | "analytics" | "advertising" | "functional" | "preference";

export interface CookiePreferences {
  essential: true;
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
  preference: boolean;
}

export const STORAGE_KEY = "awt_cookie_consent_v1";
export const OPEN_SETTINGS_EVENT = "awt:open-cookie-settings";

export const ACCEPT_ALL: CookiePreferences = {
  essential: true,
  analytics: true,
  advertising: true,
  functional: true,
  preference: true,
};

export const REJECT_ALL: CookiePreferences = {
  essential: true,
  analytics: false,
  advertising: false,
  functional: false,
  preference: false,
};

interface StoredConsent {
  preferences: CookiePreferences;
  updatedAt: string;
}

export function readConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (!parsed?.preferences) return null;
    return { ...parsed.preferences, essential: true };
  } catch {
    return null;
  }
}

export function writeConsent(preferences: CookiePreferences) {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredConsent = {
      preferences: { ...preferences, essential: true },
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore write errors (private mode, etc.) */
  }
}

/** Reopen the cookie settings modal from anywhere (e.g. footer link). */
export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
}

export const COOKIE_CATEGORY_INFO: {
  key: Exclude<CookieCategory, "essential">;
  label: string;
  description: string;
}[] = [
  {
    key: "analytics",
    label: "Analytics Cookies",
    description:
      "Help us understand which tools are used most so we can improve the site (e.g. Google Analytics).",
  },
  {
    key: "advertising",
    label: "Advertising Cookies",
    description:
      "Used to show relevant ads and measure their performance (e.g. Google AdSense), if enabled.",
  },
  {
    key: "functional",
    label: "Functional Cookies",
    description:
      "Enable enhanced features and remember choices you make to give you a richer experience.",
  },
  {
    key: "preference",
    label: "Preference Cookies",
    description:
      "Remember settings such as your light/dark theme so the site works the way you like.",
  },
];
