"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  BRANDING_SETTING_KEY,
  SEARCH_UI_LABELS_SETTING_KEY,
  type LocaleMap,
} from "@/lib/site-settings";
import {
  adminBrandingSchema,
  adminSearchUiLabelsSchema,
} from "@/lib/validators";
import { createAuditLog, parseFormData, requireAdminUser } from "./helpers";

function readLocaleMap(formData: FormData, prefix: string): LocaleMap {
  return {
    en: formData.get(`${prefix}_en`)?.toString() ?? "",
    vi: formData.get(`${prefix}_vi`)?.toString() ?? "",
    ko: formData.get(`${prefix}_ko`)?.toString() ?? "",
    ja: formData.get(`${prefix}_ja`)?.toString() ?? "",
  };
}

function isMissingSiteSettingTable(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2021" || error.code === "P2022")
  );
}

export async function updateBrandingSettingsAction(formData: FormData) {
  const session = await requireAdminUser();
  const parsed = adminBrandingSchema.parse(parseFormData(formData));

  const value = {
    siteName: parsed.siteName,
    logoUrl: parsed.logoUrl ?? "",
    logoAlt: parsed.logoAlt,
    taglines: {
      en: parsed.taglineEn,
      vi: parsed.taglineVi,
      ko: parsed.taglineKo,
      ja: parsed.taglineJa,
    },
  };

  try {
    const setting = await prisma.siteSetting.upsert({
      where: { key: BRANDING_SETTING_KEY },
      update: { value },
      create: { key: BRANDING_SETTING_KEY, value },
    });

    await createAuditLog({
      userId: session.id,
      entityType: "SiteSetting",
      entityId: setting.id,
      action: "UPDATE_BRANDING",
      metadata: { key: BRANDING_SETTING_KEY },
    });
  } catch (error) {
    if (isMissingSiteSettingTable(error)) {
      redirect("/admin/content?error=migrate-site-settings");
    }

    console.error("Failed to update branding settings.", error);
    redirect("/admin/content?error=branding-save-failed");
  }

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin/content");
  redirect("/admin/content?brandingSaved=1");
}

export async function updateSearchUiLabelsAction(formData: FormData) {
  const session = await requireAdminUser();
  const parsed = adminSearchUiLabelsSchema.parse({
    priorityTitle: readLocaleMap(formData, "priorityTitle"),
    recommended: readLocaleMap(formData, "recommended"),
    value: readLocaleMap(formData, "value"),
    comfortable: readLocaleMap(formData, "comfortable"),
    pickup: readLocaleMap(formData, "pickup"),
    fastest: readLocaleMap(formData, "fastest"),
    border: readLocaleMap(formData, "border"),
    filterTitle: readLocaleMap(formData, "filterTitle"),
    filterBody: readLocaleMap(formData, "filterBody"),
    autoUpdate: readLocaleMap(formData, "autoUpdate"),
    clearFilters: readLocaleMap(formData, "clearFilters"),
    badgeFirstTime: readLocaleMap(formData, "badgeFirstTime"),
    badgeComfortable: readLocaleMap(formData, "badgeComfortable"),
    badgeValue: readLocaleMap(formData, "badgeValue"),
    badgeFastest: readLocaleMap(formData, "badgeFastest"),
    badgeCrossBorder: readLocaleMap(formData, "badgeCrossBorder"),
    badgeManual: readLocaleMap(formData, "badgeManual"),
    pickupClear: readLocaleMap(formData, "pickupClear"),
    pickupGuided: readLocaleMap(formData, "pickupGuided"),
    pickupConfirm: readLocaleMap(formData, "pickupConfirm"),
    tripVerified: readLocaleMap(formData, "tripVerified"),
    tripRated: readLocaleMap(formData, "tripRated"),
    tripSeatsLeft: readLocaleMap(formData, "tripSeatsLeft"),
    tripViewDetails: readLocaleMap(formData, "tripViewDetails"),
    tripHideDetails: readLocaleMap(formData, "tripHideDetails"),
    tripRequestBooking: readLocaleMap(formData, "tripRequestBooking"),
    tripManual: readLocaleMap(formData, "tripManual"),
    tripRoute: readLocaleMap(formData, "tripRoute"),
    tripTourist: readLocaleMap(formData, "tripTourist"),
    tripPickup: readLocaleMap(formData, "tripPickup"),
    tripDropoff: readLocaleMap(formData, "tripDropoff"),
    comfortLabel: readLocaleMap(formData, "comfortLabel"),
  });

  const value = {
    priorityTitle: parsed.priorityTitle,
    tabs: {
      recommended: parsed.recommended,
      value: parsed.value,
      comfortable: parsed.comfortable,
      pickup: parsed.pickup,
      fastest: parsed.fastest,
      border: parsed.border,
    },
    filterSidebar: {
      title: parsed.filterTitle,
      body: parsed.filterBody,
      autoUpdate: parsed.autoUpdate,
      clearFilters: parsed.clearFilters,
    },
    recommendationBadges: {
      firstTime: parsed.badgeFirstTime,
      comfortable: parsed.badgeComfortable,
      value: parsed.badgeValue,
      fastest: parsed.badgeFastest,
      crossBorder: parsed.badgeCrossBorder,
      manual: parsed.badgeManual,
    },
    pickupBadges: {
      clear: parsed.pickupClear,
      guided: parsed.pickupGuided,
      confirm: parsed.pickupConfirm,
    },
    tripCard: {
      verified: parsed.tripVerified,
      rated: parsed.tripRated,
      seatsLeft: parsed.tripSeatsLeft,
      viewDetails: parsed.tripViewDetails,
      hideDetails: parsed.tripHideDetails,
      requestBooking: parsed.tripRequestBooking,
      manual: parsed.tripManual,
      route: parsed.tripRoute,
      tourist: parsed.tripTourist,
      pickup: parsed.tripPickup,
      dropoff: parsed.tripDropoff,
    },
    comfortLabel: parsed.comfortLabel,
  };

  try {
    const setting = await prisma.siteSetting.upsert({
      where: { key: SEARCH_UI_LABELS_SETTING_KEY },
      update: { value },
      create: { key: SEARCH_UI_LABELS_SETTING_KEY, value },
    });

    await createAuditLog({
      userId: session.id,
      entityType: "SiteSetting",
      entityId: setting.id,
      action: "UPDATE_SEARCH_UI_LABELS",
      metadata: { key: SEARCH_UI_LABELS_SETTING_KEY },
    });
  } catch (error) {
    if (isMissingSiteSettingTable(error)) {
      redirect("/admin/content?error=migrate-site-settings");
    }

    console.error("Failed to update search UI labels.", error);
    redirect("/admin/content?error=labels-save-failed");
  }

  revalidatePath("/search");
  revalidatePath("/admin/content");
  redirect("/admin/content?labelsSaved=1");
}
