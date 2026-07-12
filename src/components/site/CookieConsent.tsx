import { useCallback, useEffect, useState } from "react";
import { Cookie, Settings2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ACCEPT_ALL,
  COOKIE_CATEGORY_INFO,
  OPEN_SETTINGS_EVENT,
  REJECT_ALL,
  readConsent,
  writeConsent,
  type CookiePreferences,
} from "@/lib/cookie-consent";

const CONSENT_MESSAGE =
  "We use cookies to improve your experience, analyze website traffic, and display relevant advertisements. By clicking 'Accept', you consent to our use of cookies. You can also decline non-essential cookies.";

export function CookieConsent() {
  const [ready, setReady] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(REJECT_ALL);

  // Read stored choice after mount (SSR-safe).
  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setPrefs(stored);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
    setReady(true);
  }, []);

  // Allow reopening settings from the footer link.
  useEffect(() => {
    const handler = () => {
      setPrefs(readConsent() ?? REJECT_ALL);
      setSettingsOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, handler);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, handler);
  }, []);

  const persist = useCallback((next: CookiePreferences) => {
    writeConsent(next);
    setPrefs(next);
    setShowBanner(false);
    setSettingsOpen(false);
  }, []);

  const acceptAll = useCallback(() => persist(ACCEPT_ALL), [persist]);
  const rejectAll = useCallback(() => persist(REJECT_ALL), [persist]);
  const savePreferences = useCallback(() => persist(prefs), [persist, prefs]);

  if (!ready) return null;

  return (
    <>
      {/* Banner — first visit only */}
      {showBanner && !settingsOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-card/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-8">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-honey text-honey-foreground">
                <Cookie className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {CONSENT_MESSAGE}{" "}
                <Link to="/cookie-policy" className="font-medium text-honey hover:underline">
                  Learn more
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettingsOpen(true)}
                className="gap-1.5"
              >
                <Settings2 className="h-4 w-4" aria-hidden="true" />
                Cookie Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={rejectAll}>
                Decline
              </Button>
              <Button size="sm" onClick={acceptAll}>
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Cookie Settings</DialogTitle>
            <DialogDescription>
              Choose which cookies we can use. Essential cookies are always on because the site
              cannot work without them.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Essential — always on */}
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-secondary/40 p-4">
              <div>
                <Label className="text-sm font-semibold text-foreground">Essential Cookies</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Required for core functionality such as security and remembering your cookie
                  choice. Always active.
                </p>
              </div>
              <Switch checked disabled aria-label="Essential cookies (always enabled)" />
            </div>

            {COOKIE_CATEGORY_INFO.map((cat) => (
              <div
                key={cat.key}
                className="flex items-start justify-between gap-4 rounded-lg border border-border/60 p-4"
              >
                <div>
                  <Label
                    htmlFor={`cookie-${cat.key}`}
                    className="text-sm font-semibold text-foreground"
                  >
                    {cat.label}
                  </Label>
                  <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                </div>
                <Switch
                  id={`cookie-${cat.key}`}
                  checked={prefs[cat.key]}
                  onCheckedChange={(checked) => setPrefs((p) => ({ ...p, [cat.key]: checked }))}
                  aria-label={cat.label}
                />
              </div>
            ))}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={rejectAll}>
                Reject All
              </Button>
              <Button variant="outline" size="sm" onClick={acceptAll}>
                Accept All
              </Button>
            </div>
            <Button size="sm" onClick={savePreferences}>
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
