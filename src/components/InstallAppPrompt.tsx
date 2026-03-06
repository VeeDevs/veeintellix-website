import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const InstallAppPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  const isIOS = useMemo(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  }, []);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isStandalone) setInstalled(true);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (installed) {
    return (
      <p className="text-xs text-accent mt-4">
        App installed. Launch VeeIntellix directly from your device home screen.
      </p>
    );
  }

  if (deferredPrompt) {
    return (
      <button
        type="button"
        onClick={installApp}
        className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-primary/45 bg-primary/12 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
      >
        <Download className="w-4 h-4" />
        Install App
      </button>
    );
  }

  return (
    <p className="text-xs text-muted-foreground mt-4 max-w-lg mx-auto">
      {isIOS
        ? "On iPhone/iPad: open in Safari, tap Share, then Add to Home Screen."
        : "In Chrome/Edge: open browser menu and select Install app or Add to Home screen."}
    </p>
  );
};

export default InstallAppPrompt;
