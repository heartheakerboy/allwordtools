import { Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DictionaryLookup } from "./dictionary/DictionaryLookup";
import { allPhonetics } from "@/lib/dictionary";

export function Pronunciation() {
  return (
    <DictionaryLookup
      label="Enter a word"
      placeholder="e.g. worcestershire"
      action="Pronounce"
      showAudio={false}
      hint="Type a word to hear how it's said and see its phonetic spelling. Tap any speaker to play the audio pronunciation."
    >
      {(entries, term) => {
        const phonetics = allPhonetics(entries);
        const withAudio = phonetics.filter((p) => p.audio);
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              {phonetics.find((p) => p.text)?.text && (
                <span className="font-mono text-2xl text-honey">
                  {phonetics.find((p) => p.text)?.text}
                </span>
              )}
            </div>

            {withAudio.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Audio pronunciations</p>
                <div className="flex flex-wrap gap-2">
                  {withAudio.map((p, i) => (
                    <Button
                      key={i}
                      variant="secondary"
                      onClick={() =>
                        new Audio(p.audio!)
                          .play()
                          .catch(() => toast.error("Couldn't play the audio."))
                      }
                      className="rounded-2xl"
                    >
                      <Volume2 className="mr-2 h-4 w-4" />
                      {p.text || `Play ${i + 1}`}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
                No audio pronunciation is available for &ldquo;{term}&rdquo;, but the phonetic
                spelling above shows how to say it.
              </p>
            )}
          </div>
        );
      }}
    </DictionaryLookup>
  );
}
