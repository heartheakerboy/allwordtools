// ============================================================================
// Premium language switcher.
//
// Features: searchable list, native names + flags, pinned + recently-used
// sections, current-locale check. Switching persists the choice and reloads
// the equivalent URL in the new locale (full navigation guarantees correct
// SSR + dictionary for the target language).
// ============================================================================

import { useMemo, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Check, Globe, Pin, PinOff } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { enabledLocales, getLocale } from "@/i18n/locales";
import { switchLocalePath } from "@/i18n/paths";
import {
  getPinnedLocales,
  getRecentLocales,
  saveLocale,
  togglePinnedLocale,
} from "@/i18n/detectLocale";

export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  const all = useMemo(() => enabledLocales(), []);
  const current = getLocale(locale);

  function refreshLists() {
    setPinned(getPinnedLocales());
    setRecent(getRecentLocales());
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) refreshLists();
  }

  function selectLocale(code: string) {
    if (code === locale) {
      setOpen(false);
      return;
    }
    saveLocale(code);
    // Full navigation so the target locale is server-rendered correctly.
    window.location.assign(switchLocalePath(pathname, code));
  }

  function handleTogglePin(code: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPinned(togglePinnedLocale(code));
  }

  const pinnedList = all.filter((l) => pinned.includes(l.code));
  const recentList = all.filter((l) => recent.includes(l.code) && !pinned.includes(l.code));

  const renderItem = (code: string) => {
    const l = getLocale(code);
    if (!l) return null;
    const active = l.code === locale;
    const isPinned = pinned.includes(l.code);
    return (
      <CommandItem
        key={l.code}
        value={`${l.name} ${l.nativeName} ${l.code}`}
        onSelect={() => selectLocale(l.code)}
        className="flex cursor-pointer items-center gap-2.5"
      >
        <span className="text-base leading-none" aria-hidden>
          {l.flag}
        </span>
        <span className="flex-1 truncate">
          <span className="font-medium">{l.nativeName}</span>
          <span className="ml-2 text-xs text-muted-foreground">{l.name}</span>
        </span>
        {active ? (
          <Check className="h-4 w-4 text-honey" aria-label={t("switcher.current")} />
        ) : (
          <button
            type="button"
            onClick={(e) => handleTogglePin(l.code, e)}
            className="text-muted-foreground/60 transition-colors hover:text-honey"
            aria-label={isPinned ? "Unpin" : "Pin"}
          >
            {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
          </button>
        )}
      </CommandItem>
    );
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 rounded-full"
          aria-label={t("switcher.choose")}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden text-sm font-medium sm:inline">
            {current?.flag} {current?.code.toUpperCase()}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0">
        <Command>
          <CommandInput placeholder={t("switcher.searchPlaceholder")} />
          <CommandList>
            <CommandEmpty>{t("switcher.empty")}</CommandEmpty>
            {pinnedList.length > 0 && (
              <CommandGroup heading={t("switcher.pinned")}>
                {pinnedList.map((l) => renderItem(l.code))}
              </CommandGroup>
            )}
            {recentList.length > 0 && (
              <CommandGroup heading={t("switcher.recent")}>
                {recentList.map((l) => renderItem(l.code))}
              </CommandGroup>
            )}
            <CommandGroup heading={t("switcher.all")}>
              {all.map((l) => renderItem(l.code))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
