
"use client";

import { useUser } from "@/context/user-context";
import { translations } from "@/lib/translations";

export function useTranslations() {
  const { language } = useUser();
  return translations[language];
}
