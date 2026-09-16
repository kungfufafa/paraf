import { create } from "zustand";
import type { Lang } from "./i18n";
import { copy } from "./i18n";

type TCopy = (typeof copy)[Lang];

function readLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const v = window.localStorage.getItem("paraf-lang");
    return v === "id" ? "id" : "en";
  } catch {
    return "en";
  }
}

export const useLang = create<{ lang: Lang; setLang: (l: Lang) => void; t: TCopy }>((set) => ({
  lang: "en",
  t: copy.en,
  setLang: (lang) => {
    try {
      window.localStorage.setItem("paraf-lang", lang);
    } catch {
      /* ignore */
    }
    set({ lang, t: copy[lang] });
  },
}));

export function hydrateLang() {
  const lang = readLang();
  useLang.setState({ lang, t: copy[lang] });
}

export function useT() {
  return useLang((s) => s.t);
}
