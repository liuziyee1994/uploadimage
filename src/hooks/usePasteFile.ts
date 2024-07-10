import { useEffect } from "react";

export function usePasteFile({ onPasteFiles }: { onPasteFiles: (files: File[]) => void }) {
  useEffect(() => {
    const pasteCallback = (e: ClipboardEvent) => {
      if (!e.clipboardData) {
        return;
      }

      const files: File[] = [];
      Array.from(e.clipboardData.items).forEach((item) => {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      });
      if (files.length > 0) {
        onPasteFiles(files);
      }
    };
    document.body.addEventListener("paste", pasteCallback);

    return () => {
      document.body.removeEventListener("paste", pasteCallback);
    }
  }, [onPasteFiles]);
}
