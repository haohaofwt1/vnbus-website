"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { adminCopy } from "@/components/admin/admin-copy";
import { localeLabels, resolveLocale, supportedLocales, type Locale, withLang } from "@/lib/i18n";

const adminLocaleStorageKey = "vnbus-admin-locale";
const adminLocaleStorageEvent = "vnbus-admin-locale-change";

function subscribeAdminLocale(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(adminLocaleStorageEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(adminLocaleStorageEvent, onStoreChange);
  };
}

function getAdminLocaleSnapshot() {
  return resolveLocale(window.localStorage.getItem(adminLocaleStorageKey));
}

function getServerAdminLocaleSnapshot() {
  return "en" as Locale;
}

export function setAdminLocale(locale: Locale) {
  window.localStorage.setItem(adminLocaleStorageKey, locale);
  window.dispatchEvent(new Event(adminLocaleStorageEvent));
}

export function useAdminLocale() {
  const searchParams = useSearchParams();
  const storedLocale = useSyncExternalStore(
    subscribeAdminLocale,
    getAdminLocaleSnapshot,
    getServerAdminLocaleSnapshot,
  );
  const urlLocaleValue = searchParams.get("lang");
  const locale = urlLocaleValue ? resolveLocale(urlLocaleValue) : storedLocale;

  useEffect(() => {
    if (urlLocaleValue) {
      setAdminLocale(resolveLocale(urlLocaleValue));
    }
  }, [urlLocaleValue]);

  return locale;
}

export function useAdminCopy() {
  return adminCopy[useAdminLocale()];
}

export function adminLocalizedHref(path: string, locale: Locale) {
  return withLang(path, locale);
}

export function translateAdminFilter(locale: Locale, value: string, fallback: string) {
  return adminCopy[locale].filters[value] ?? adminCopy.en.filters[value] ?? fallback;
}

export function translateAdminStatus(locale: Locale, value: string, fallback: string) {
  return adminCopy[locale].statuses[value] ?? adminCopy.en.statuses[value] ?? fallback;
}

export function translateAdminText(locale: Locale, value: string) {
  return adminCopy[locale].texts[value] ?? adminCopy.en.texts[value] ?? value;
}

export function formatAdminTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export { localeLabels, supportedLocales, type Locale };
