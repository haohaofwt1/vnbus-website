"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  BRANDING_SETTING_KEY,
  FOOTER_SETTING_KEY,
  HOMEPAGE_SETTING_KEY,
  POLICY_PAGE_SETTING_KEY,
  SEARCH_UI_LABELS_SETTING_KEY,
  VEHICLE_PAGE_SETTING_KEY,
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
      redirect("/admin/content/header?error=migrate-site-settings");
    }

    console.error("Failed to update branding settings.", error);
    redirect("/admin/content/header?error=save-failed");
  }

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/header");
  revalidatePath("/admin/content/branding");
  redirect("/admin/content/header?saved=1");
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
    tripFitScore: readLocaleMap(formData, "tripFitScore"),
    tripAiNotePrefix: readLocaleMap(formData, "tripAiNotePrefix"),
    tripRatingReason: readLocaleMap(formData, "tripRatingReason"),
    tripVerifiedReason: readLocaleMap(formData, "tripVerifiedReason"),
    tripComfortReason: readLocaleMap(formData, "tripComfortReason"),
    tripPickupReason: readLocaleMap(formData, "tripPickupReason"),
    tripSeatsReason: readLocaleMap(formData, "tripSeatsReason"),
    tripRoute: readLocaleMap(formData, "tripRoute"),
    tripTourist: readLocaleMap(formData, "tripTourist"),
    tripPickup: readLocaleMap(formData, "tripPickup"),
    tripDropoff: readLocaleMap(formData, "tripDropoff"),
    routeMapTitle: readLocaleMap(formData, "routeMapTitle"),
    routeInfoTitle: readLocaleMap(formData, "routeInfoTitle"),
    routeTipsTitle: readLocaleMap(formData, "routeTipsTitle"),
    routeDefaultTipBody: readLocaleMap(formData, "routeDefaultTipBody"),
    routeNoCoordinates: readLocaleMap(formData, "routeNoCoordinates"),
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
      fitScore: parsed.tripFitScore,
      aiNotePrefix: parsed.tripAiNotePrefix,
      ratingReason: parsed.tripRatingReason,
      verifiedReason: parsed.tripVerifiedReason,
      comfortReason: parsed.tripComfortReason,
      pickupReason: parsed.tripPickupReason,
      seatsReason: parsed.tripSeatsReason,
      route: parsed.tripRoute,
      tourist: parsed.tripTourist,
      pickup: parsed.tripPickup,
      dropoff: parsed.tripDropoff,
    },
    routePanel: {
      mapTitle: parsed.routeMapTitle,
      routeInfoTitle: parsed.routeInfoTitle,
      tipsTitle: parsed.routeTipsTitle,
      defaultTipBody: parsed.routeDefaultTipBody,
      noCoordinates: parsed.routeNoCoordinates,
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
      redirect("/admin/content/search-labels?error=migrate-site-settings");
    }

    console.error("Failed to update search UI labels.", error);
    redirect("/admin/content/search-labels?error=save-failed");
  }

  revalidatePath("/search");
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/search-labels");
  redirect("/admin/content/search-labels?saved=1");
}

function readRows(formData: FormData, prefix: string, fields: string[], count: number) {
  return Array.from({ length: count }, (_, index) =>
    Object.fromEntries(
      fields.map((field) => [field, formData.get(`${prefix}_${index}_${field}`)?.toString().trim() ?? ""]),
    ),
  ).filter((row) => Object.values(row).some(Boolean));
}

function readSmartSuggestionRows(formData: FormData) {
  return Array.from({ length: 6 }, (_, index) => {
    const id = formData.get(`smart_${index}_id`)?.toString().trim() || `smart-${index + 1}`;
    const displayOrder = Number(formData.get(`smart_${index}_displayOrder`)?.toString() || index + 1);

    return {
      id,
      title: formData.get(`smart_${index}_title`)?.toString().trim() ?? "",
      description: formData.get(`smart_${index}_description`)?.toString().trim() ?? "",
      href: formData.get(`smart_${index}_href`)?.toString().trim() ?? "/search",
      icon: formData.get(`smart_${index}_icon`)?.toString().trim() ?? "budget",
      color: formData.get(`smart_${index}_color`)?.toString().trim() ?? "blue",
      enabled: formData.get(`smart_${index}_enabled`) === "on",
      showOnHomepage: formData.get(`smart_${index}_showOnHomepage`) === "on",
      displayOrder: Number.isFinite(displayOrder) ? displayOrder : index + 1,
    };
  }).filter((row) => row.title && row.href);
}

function readFooterLinks(formData: FormData, groupIndex: number) {
  return Array.from({ length: 5 }, (_, index) => ({
    label: readLocaleMap(formData, `footer_group_${groupIndex}_link_${index}_label`),
    href: formData.get(`footer_group_${groupIndex}_link_${index}_href`)?.toString().trim() ?? "",
  })).filter((link) => Object.values(link.label).some(Boolean) && link.href);
}

export async function updateFooterSettingsAction(formData: FormData) {
  const session = await requireAdminUser();
  const value = {
    description: readLocaleMap(formData, "footer_description"),
    phoneNumbers: Array.from({ length: 3 }, (_, index) => formData.get(`footer_phone_${index}`)?.toString().trim() ?? "").filter(Boolean),
    socialLinks: Array.from({ length: 3 }, (_, index) => {
      const type = formData.get(`footer_social_${index}_type`)?.toString().trim();
      return {
        label: readLocaleMap(formData, `footer_social_${index}_label`),
        href: formData.get(`footer_social_${index}_href`)?.toString().trim() ?? "",
        type: type === "facebook" ? "facebook" : "message",
      };
    }).filter((item) => Object.values(item.label).some(Boolean) && item.href),
    groups: Array.from({ length: 4 }, (_, index) => ({
      title: readLocaleMap(formData, `footer_group_${index}_title`),
      links: readFooterLinks(formData, index),
    })).filter((group) => Object.values(group.title).some(Boolean) && group.links.length),
    contact: {
      title: readLocaleMap(formData, "footer_contact_title"),
      address: readLocaleMap(formData, "footer_contact_address"),
      email: formData.get("footer_contact_email")?.toString().trim() ?? "",
      hours: readLocaleMap(formData, "footer_contact_hours"),
    },
    paymentBadges: Array.from({ length: 4 }, (_, index) => ({
      label: readLocaleMap(formData, `footer_payment_${index}_label`),
    })).filter((item) => Object.values(item.label).some(Boolean)),
    verifiedBadge: readLocaleMap(formData, "footer_verified_badge"),
    copyright: readLocaleMap(formData, "footer_copyright"),
    tagline: readLocaleMap(formData, "footer_tagline"),
  };

  try {
    const setting = await prisma.siteSetting.upsert({
      where: { key: FOOTER_SETTING_KEY },
      update: { value },
      create: { key: FOOTER_SETTING_KEY, value },
    });

    await createAuditLog({
      userId: session.id,
      entityType: "SiteSetting",
      entityId: setting.id,
      action: "UPDATE_FOOTER",
      metadata: { key: FOOTER_SETTING_KEY },
    });
  } catch (error) {
    if (isMissingSiteSettingTable(error)) {
      redirect("/admin/content/footer?error=migrate-site-settings");
    }

    console.error("Failed to update footer settings.", error);
    redirect("/admin/content/footer?error=save-failed");
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/footer");
  redirect("/admin/content/footer?saved=1");
}

export async function updateHomepageSettingsAction(formData: FormData) {
  const session = await requireAdminUser();
  const value = {
    hero: {
      badge: formData.get("hero_badge")?.toString().trim() ?? "",
      titlePrefix: formData.get("hero_titlePrefix")?.toString().trim() ?? "",
      titleAccent: formData.get("hero_titleAccent")?.toString().trim() ?? "",
      titleSuffix: formData.get("hero_titleSuffix")?.toString().trim() ?? "",
      body: formData.get("hero_body")?.toString().trim() ?? "",
      popularSearchesLabel: formData.get("hero_popularSearchesLabel")?.toString().trim() ?? "",
      stats: readRows(formData, "hero_stats", ["value", "label"], 4),
      popularSearches: readRows(formData, "hero_popularSearches", ["label", "href"], 6),
    },
    styleSection: {
      eyebrow: formData.get("style_eyebrow")?.toString().trim() ?? "",
      title: formData.get("style_title")?.toString().trim() ?? "",
      action: formData.get("style_action")?.toString().trim() ?? "",
      href: formData.get("style_href")?.toString().trim() ?? "/search",
      cards: readRows(formData, "style_cards", ["title", "body", "vehicle", "smart"], 6),
    },
    smartSuggestions: readSmartSuggestionRows(formData),
    borderSection: {
      eyebrow: formData.get("border_eyebrow")?.toString().trim() ?? "",
      title: formData.get("border_title")?.toString().trim() ?? "",
      action: formData.get("border_action")?.toString().trim() ?? "",
      href: formData.get("border_href")?.toString().trim() ?? "/search?smart=border",
      routes: readRows(formData, "border_routes", ["from", "to", "wait", "vehicle"], 6),
      map: {
        eyebrow: formData.get("map_eyebrow")?.toString().trim() ?? "",
        title: formData.get("map_title")?.toString().trim() ?? "",
        status: formData.get("map_status")?.toString().trim() ?? "",
        confidenceLabel: formData.get("map_confidenceLabel")?.toString().trim() ?? "",
        confidenceValue: formData.get("map_confidenceValue")?.toString().trim() ?? "",
        waitLabel: formData.get("map_waitLabel")?.toString().trim() ?? "",
        waitValue: formData.get("map_waitValue")?.toString().trim() ?? "",
        supportLabel: formData.get("map_supportLabel")?.toString().trim() ?? "",
        supportValue: formData.get("map_supportValue")?.toString().trim() ?? "",
        lanes: readRows(formData, "map_lanes", ["label", "value"], 3),
        notes: readRows(formData, "map_notes", ["value"], 4).map((row) => row.value),
      },
    },
  };

  try {
    const setting = await prisma.siteSetting.upsert({
      where: { key: HOMEPAGE_SETTING_KEY },
      update: { value },
      create: { key: HOMEPAGE_SETTING_KEY, value },
    });

    await createAuditLog({
      userId: session.id,
      entityType: "SiteSetting",
      entityId: setting.id,
      action: "UPDATE_HOMEPAGE",
      metadata: { key: HOMEPAGE_SETTING_KEY },
    });
  } catch (error) {
    if (isMissingSiteSettingTable(error)) {
      redirect("/admin/content/homepage?error=migrate-site-settings");
    }

    console.error("Failed to update homepage settings.", error);
    redirect("/admin/content/homepage?error=save-failed");
  }

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/homepage");
  redirect("/admin/content/homepage?saved=1");
}

export async function updateVehiclePageSettingsAction(formData: FormData) {
  const session = await requireAdminUser();
  const value = {
    bannerImageUrl: formData.get("vehiclePage_bannerImageUrl")?.toString().trim() ?? "",
    bannerAlt: formData.get("vehiclePage_bannerAlt")?.toString().trim() ?? "",
  };

  try {
    const setting = await prisma.siteSetting.upsert({
      where: { key: VEHICLE_PAGE_SETTING_KEY },
      update: { value },
      create: { key: VEHICLE_PAGE_SETTING_KEY, value },
    });

    await createAuditLog({
      userId: session.id,
      entityType: "SiteSetting",
      entityId: setting.id,
      action: "UPDATE_VEHICLE_PAGE",
      metadata: { key: VEHICLE_PAGE_SETTING_KEY },
    });
  } catch (error) {
    if (isMissingSiteSettingTable(error)) {
      redirect("/admin/content/vehicle-page?error=migrate-site-settings");
    }

    console.error("Failed to update vehicle page settings.", error);
    redirect("/admin/content/vehicle-page?error=save-failed");
  }

  revalidatePath("/vehicles");
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/vehicle-page");
  redirect("/admin/content/vehicle-page?saved=1");
}

export async function updatePolicyPageSettingsAction(formData: FormData) {
  const session = await requireAdminUser();
  const value = {
    title: readLocaleMap(formData, "policy_title"),
    intro: readLocaleMap(formData, "policy_intro"),
    body: readLocaleMap(formData, "policy_body"),
    updatedLabel: readLocaleMap(formData, "policy_updatedLabel"),
    updatedAtText: formData.get("policy_updatedAtText")?.toString().trim() ?? "",
  };

  try {
    const setting = await prisma.siteSetting.upsert({
      where: { key: POLICY_PAGE_SETTING_KEY },
      update: { value },
      create: { key: POLICY_PAGE_SETTING_KEY, value },
    });

    await createAuditLog({
      userId: session.id,
      entityType: "SiteSetting",
      entityId: setting.id,
      action: "UPDATE_POLICY_PAGE",
      metadata: { key: POLICY_PAGE_SETTING_KEY },
    });
  } catch (error) {
    if (isMissingSiteSettingTable(error)) {
      redirect("/admin/content/policy?error=migrate-site-settings");
    }

    console.error("Failed to update policy page settings.", error);
    redirect("/admin/content/policy?error=save-failed");
  }

  revalidatePath("/policy");
  revalidatePath("/admin/content");
  revalidatePath("/admin/content/policy");
  redirect("/admin/content/policy?saved=1");
}
