import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface InstallChoice {
  outcome: "accepted" | "dismissed";
  platform: string;
}

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
}

export function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const isIOSDevice =
      /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
    setIsInstalled(
      window.matchMedia("(display-mode: standalone)").matches ||
        (isIOSDevice && "standalone" in navigator && navigator.standalone === true),
    );

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Unable to register the app service worker:", error);
      });
    }

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    const handleInstalled = () => setIsInstalled(true);

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function installApp() {
    if (!installEvent) {
      setShowInstructions(true);
      return;
    }

    setInstalling(true);
    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      setInstallEvent(null);
      if (choice.outcome === "accepted") setIsInstalled(true);
    } catch (error) {
      console.error("Unable to open the app install prompt:", error);
      setShowInstructions(true);
    } finally {
      setInstalling(false);
    }
  }

  if (isInstalled || dismissed) return null;

  return (
    <aside className="fixed bottom-4 right-4 z-[60] w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-card">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Download className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg">Install Abi's Kitchen</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Install the app for quick access to the menu and ordering.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-full p-1 text-muted-foreground hover:bg-muted"
          aria-label="Dismiss install option"
        >
          <X className="size-4" />
        </button>
      </div>
      {showInstructions && (
        <p className="mt-3 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
          {isIOS
            ? "On iPhone or iPad, use your browser's Share menu, choose Add to Home Screen, then tap Add."
            : "Open your browser's menu and choose Install app or Add to Home screen."}
        </p>
      )}
      <button
        type="button"
        onClick={installApp}
        disabled={installing}
        className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
      >
        {installing ? "Opening install…" : "Install"}
      </button>
    </aside>
  );
}
