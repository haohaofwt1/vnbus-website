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
  defaultSearchUiLabels,
  defaultVehiclePageSettings,
  HOMEPAGE_SETTING_KEY,
  PAYMENT_SETTING_KEY,
  SEARCH_UI_LABELS_SETTING_KEY,
  VEHICLE_PAGE_SETTING_KEY,
} from "@/lib/site-settings-defaults";

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

export const getFooterSettings = cache(async () =>
  getSettingValue(FOOTER_SETTING_KEY, defaultFooterSettings),
);

export const getVehiclePageSettings = cache(async () =>
  getSettingValue(VEHICLE_PAGE_SETTING_KEY, defaultVehiclePageSettings),
);

export const getPaymentSettings = cache(async () =>
  getSettingValue(PAYMENT_SETTING_KEY, defaultPaymentSettings),
);
