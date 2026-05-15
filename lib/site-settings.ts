import { cache } from "react";
import { prisma } from "@/lib/prisma";
export * from "@/lib/site-settings-defaults";
import {
  BRANDING_SETTING_KEY,
  FOOTER_SETTING_KEY,
  defaultBrandingSettings,
  defaultFooterSettings,
  defaultHomepageSettings,
  defaultPaymentSettings,
  defaultPolicyPageSettings,
  defaultSearchUiLabels,
  defaultVehiclePageSettings,
  HOMEPAGE_SETTING_KEY,
  PAYMENT_SETTING_KEY,
  POLICY_PAGE_SETTING_KEY,
  SEARCH_UI_LABELS_SETTING_KEY,
  VEHICLE_PAGE_SETTING_KEY,
  type FooterSettings,
  type LocaleMap,
} from "@/lib/site-settings-defaults";
import type { Locale } from "@/lib/i18n";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeSettings<T>(defaults: T, overrides: unknown): T {
  if (!isObject(defaults) || !isObject(overrides)) {
    return (overrides ?? defaults) as T;
  }

  const merged = { ...defaults } as Record<string, unknown>;

  Object.entries(overrides).forEach(([key, value]) => {
    const defaultValue = merged[key];

    if (isObject(defaultValue) && isObject(value)) {
      merged[key] = mergeSettings(defaultValue, value);
      return;
    }

    if (value !== undefined) {
      merged[key] = value;
    }
  });

  return merged as T;
}

async function getSettingValue<T>(key: string, defaults: T) {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key },
      select: { value: true },
    });

    if (!setting) {
      return defaults;
    }

    return mergeSettings(defaults, setting.value);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Failed to load site setting "${key}", falling back to defaults.`, error);
    }

    return defaults;
  }
}

export const getBrandingSettings = cache(async () =>
  getSettingValue(BRANDING_SETTING_KEY, defaultBrandingSettings),
);

export const getSearchUiLabels = cache(async () =>
  getSettingValue(SEARCH_UI_LABELS_SETTING_KEY, defaultSearchUiLabels),
);

export const getHomepageSettings = cache(async () =>
  getSettingValue(HOMEPAGE_SETTING_KEY, defaultHomepageSettings),
);

const locales: Locale[] = ["en", "vi", "ko", "ja"];

function asLocaleMap(value: unknown, fallback: LocaleMap): LocaleMap {
  if (typeof value === "string") {
    return {
      en: value || fallback.en,
      vi: value || fallback.vi,
      ko: value || fallback.ko,
      ja: value || fallback.ja,
    };
  }

  if (!isObject(value)) {
    return fallback;
  }

  return locales.reduce((next, locale) => {
    const localized = value[locale];
    next[locale] = typeof localized === "string" && localized.trim() ? localized : fallback[locale];
    return next;
  }, {} as LocaleMap);
}

function normalizeFooterSettings(settings: unknown): FooterSettings {
  const source = isObject(settings) ? settings : {};
  const fallback = defaultFooterSettings;

  const rawGroups = Array.isArray(source.groups) ? source.groups : [];
  const rawSocial = Array.isArray(source.socialLinks) ? source.socialLinks : [];
  const rawBadges = Array.isArray(source.paymentBadges) ? source.paymentBadges : [];
  const groupsSource = Array.from({ length: Math.max(rawGroups.length, fallback.groups.length) }, (_, index) => rawGroups[index] ?? fallback.groups[index]);
  const socialSource = Array.from({ length: Math.max(rawSocial.length, fallback.socialLinks.length) }, (_, index) => rawSocial[index] ?? fallback.socialLinks[index]);
  const badgesSource = Array.from({ length: Math.max(rawBadges.length, fallback.paymentBadges.length) }, (_, index) => rawBadges[index] ?? fallback.paymentBadges[index]);
  const contactSource = isObject(source.contact) ? source.contact : {};

  return {
    description: asLocaleMap(source.description, fallback.description),
    phoneNumbers: Array.isArray(source.phoneNumbers) ? source.phoneNumbers.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : fallback.phoneNumbers,
    socialLinks: socialSource.map((item, index) => {
      const row = isObject(item) ? item : {};
      const fallbackRow = fallback.socialLinks[index] ?? fallback.socialLinks[0];
      const type: "message" | "facebook" = row.type === "facebook" ? "facebook" : "message";

      return {
        label: asLocaleMap(row.label, fallbackRow.label),
        href: typeof row.href === "string" && row.href.trim() ? row.href : fallbackRow.href,
        type,
      };
    }).filter((item) => item.href),
    groups: groupsSource.map((group, groupIndex) => {
      const row = isObject(group) ? group : {};
      const fallbackGroup = fallback.groups[groupIndex] ?? fallback.groups[0];
      const linksSource = Array.isArray(row.links) ? row.links : fallbackGroup.links;

      return {
        title: asLocaleMap(row.title, fallbackGroup.title),
        links: linksSource.map((link, linkIndex) => {
          const linkRow = isObject(link) ? link : {};
          const fallbackLink = fallbackGroup.links[linkIndex] ?? fallbackGroup.links[0];

          return {
            label: asLocaleMap(linkRow.label, fallbackLink.label),
            href: typeof linkRow.href === "string" && linkRow.href.trim() ? linkRow.href : fallbackLink.href,
          };
        }).filter((link) => link.href),
      };
    }).filter((group) => group.links.length),
    contact: {
      title: asLocaleMap(contactSource.title, fallback.contact.title),
      address: asLocaleMap(contactSource.address, fallback.contact.address),
      email: typeof contactSource.email === "string" && contactSource.email.trim() ? contactSource.email : fallback.contact.email,
      hours: asLocaleMap(contactSource.hours, fallback.contact.hours),
    },
    paymentBadges: badgesSource.map((badge, index) => {
      const row = isObject(badge) ? badge : {};
      const fallbackBadge = fallback.paymentBadges[index] ?? fallback.paymentBadges[0];
      return { label: asLocaleMap(row.label, fallbackBadge.label) };
    }),
    verifiedBadge: asLocaleMap(source.verifiedBadge, fallback.verifiedBadge),
    copyright: asLocaleMap(source.copyright, fallback.copyright),
    tagline: asLocaleMap(source.tagline, fallback.tagline),
  };
}

export const getFooterSettings = cache(async () =>
  normalizeFooterSettings(await getSettingValue(FOOTER_SETTING_KEY, defaultFooterSettings)),
);

export const getVehiclePageSettings = cache(async () =>
  getSettingValue(VEHICLE_PAGE_SETTING_KEY, defaultVehiclePageSettings),
);

export const getPaymentSettings = cache(async () =>
  getSettingValue(PAYMENT_SETTING_KEY, defaultPaymentSettings),
);

export const getPolicyPageSettings = cache(async () =>
  getSettingValue(POLICY_PAGE_SETTING_KEY, defaultPolicyPageSettings),
);
