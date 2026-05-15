import type { LocaleMap, SearchUiLabels } from "@/lib/site-settings";
import { updateSearchUiLabelsAction } from "@/lib/actions/admin-content";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

function LocaleFields({
  prefix,
  label,
  values,
}: {
  prefix: string;
  label: string;
  values: LocaleMap;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-4">
      <p className="text-sm font-semibold text-ink">{label}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {([
          ["en", "EN", values.en],
          ["vi", "VI", values.vi],
          ["ko", "KO", values.ko],
          ["ja", "JA", values.ja],
        ] as const).map(([locale, localeLabel, value]) => (
          <label key={`${prefix}_${locale}`} className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {localeLabel}
            </span>
            <input
              name={`${prefix}_${locale}`}
              defaultValue={value}
              className={inputClass}
              required
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export function SearchUiLabelsForm({
  labels,
}: {
  labels: SearchUiLabels;
}) {
  return (
    <form action={updateSearchUiLabelsAction} className="card-surface space-y-6 p-6">
      <div>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
          Search UI labels
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Control public labels shown on search priority, trip badges, pickup clarity, and trip cards.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Priority tabs</h3>
        <LocaleFields prefix="priorityTitle" label="Priority title" values={labels.priorityTitle} />
        <LocaleFields prefix="recommended" label="Recommended" values={labels.tabs.recommended} />
        <LocaleFields prefix="value" label="Best value" values={labels.tabs.value} />
        <LocaleFields prefix="comfortable" label="Most comfortable" values={labels.tabs.comfortable} />
        <LocaleFields prefix="pickup" label="Easiest pickup" values={labels.tabs.pickup} />
        <LocaleFields prefix="fastest" label="Fastest" values={labels.tabs.fastest} />
        <LocaleFields prefix="border" label="Cross-border ready" values={labels.tabs.border} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Filter sidebar</h3>
        <LocaleFields prefix="filterTitle" label="Filter title" values={labels.filterSidebar.title} />
        <LocaleFields prefix="filterBody" label="Filter body" values={labels.filterSidebar.body} />
        <LocaleFields prefix="autoUpdate" label="Auto update note" values={labels.filterSidebar.autoUpdate} />
        <LocaleFields prefix="clearFilters" label="Clear filters button" values={labels.filterSidebar.clearFilters} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Recommendation badges</h3>
        <LocaleFields prefix="badgeFirstTime" label="Best for first-time travellers" values={labels.recommendationBadges.firstTime} />
        <LocaleFields prefix="badgeComfortable" label="Most comfortable" values={labels.recommendationBadges.comfortable} />
        <LocaleFields prefix="badgeValue" label="Best value" values={labels.recommendationBadges.value} />
        <LocaleFields prefix="badgeFastest" label="Fastest option" values={labels.recommendationBadges.fastest} />
        <LocaleFields prefix="badgeCrossBorder" label="Cross-border ready" values={labels.recommendationBadges.crossBorder} />
        <LocaleFields prefix="badgeManual" label="Manual confirmation" values={labels.recommendationBadges.manual} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Pickup & comfort labels</h3>
        <LocaleFields prefix="pickupClear" label="Clear pickup" values={labels.pickupBadges.clear} />
        <LocaleFields prefix="pickupGuided" label="Pickup guided" values={labels.pickupBadges.guided} />
        <LocaleFields prefix="pickupConfirm" label="Confirm pickup" values={labels.pickupBadges.confirm} />
        <LocaleFields prefix="comfortLabel" label="Comfort label" values={labels.comfortLabel} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Trip card labels</h3>
        <LocaleFields prefix="tripVerified" label="Verified" values={labels.tripCard.verified} />
        <LocaleFields prefix="tripRated" label="Rated" values={labels.tripCard.rated} />
        <LocaleFields prefix="tripSeatsLeft" label="Seats left" values={labels.tripCard.seatsLeft} />
        <LocaleFields prefix="tripViewDetails" label="View details" values={labels.tripCard.viewDetails} />
        <LocaleFields prefix="tripHideDetails" label="Hide details" values={labels.tripCard.hideDetails} />
        <LocaleFields prefix="tripRequestBooking" label="Request booking" values={labels.tripCard.requestBooking} />
        <LocaleFields prefix="tripManual" label="Manual confirmation before payment" values={labels.tripCard.manual} />
        <LocaleFields prefix="tripFitScore" label="Fit score" values={labels.tripCard.fitScore} />
        <LocaleFields prefix="tripAiNotePrefix" label="AI note prefix" values={labels.tripCard.aiNotePrefix} />
        <LocaleFields prefix="tripRatingReason" label="AI reason: rating" values={labels.tripCard.ratingReason} />
        <LocaleFields prefix="tripVerifiedReason" label="AI reason: verified" values={labels.tripCard.verifiedReason} />
        <LocaleFields prefix="tripComfortReason" label="AI reason: comfort" values={labels.tripCard.comfortReason} />
        <LocaleFields prefix="tripPickupReason" label="AI reason: pickup" values={labels.tripCard.pickupReason} />
        <LocaleFields prefix="tripSeatsReason" label="AI reason: seats" values={labels.tripCard.seatsReason} />
        <LocaleFields prefix="tripRoute" label="Route" values={labels.tripCard.route} />
        <LocaleFields prefix="tripTourist" label="Tourist-friendly" values={labels.tripCard.tourist} />
        <LocaleFields prefix="tripPickup" label="Pickup" values={labels.tripCard.pickup} />
        <LocaleFields prefix="tripDropoff" label="Drop-off" values={labels.tripCard.dropoff} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Route intelligence panel</h3>
        <LocaleFields prefix="routeMapTitle" label="Map title" values={labels.routePanel.mapTitle} />
        <LocaleFields prefix="routeOverview" label="Route overview" values={labels.routePanel.routeOverview} />
        <LocaleFields prefix="routeSelectedTrip" label="Selected trip" values={labels.routePanel.selectedTrip} />
        <LocaleFields prefix="routeDistance" label="Distance" values={labels.routePanel.distance} />
        <LocaleFields prefix="routeDuration" label="Duration" values={labels.routePanel.duration} />
        <LocaleFields prefix="routeAverageDuration" label="Average duration" values={labels.routePanel.averageDuration} />
        <LocaleFields prefix="routeCommonRoad" label="Common road" values={labels.routePanel.commonRoad} />
        <LocaleFields prefix="routeInfoTitle" label="Route info title" values={labels.routePanel.routeInfoTitle} />
        <LocaleFields prefix="routeTipsTitle" label="Tips title" values={labels.routePanel.tipsTitle} />
        <LocaleFields prefix="routeDefaultTipBody" label="Default tip body" values={labels.routePanel.defaultTipBody} />
        <LocaleFields prefix="routeNoCoordinates" label="No coordinates message" values={labels.routePanel.noCoordinates} />
        <LocaleFields prefix="routeLocationWillBeConfirmed" label="Location confirmation note" values={labels.routePanel.locationWillBeConfirmed} />
        <LocaleFields prefix="routeInternationalRoute" label="International route badge" values={labels.routePanel.internationalRoute} />
        <LocaleFields prefix="routeBorderDocumentNote" label="Border document note" values={labels.routePanel.borderDocumentNote} />
        <LocaleFields prefix="routeBorderSupport" label="Border support badge" values={labels.routePanel.borderSupport} />
        <LocaleFields prefix="routeViewLargeMap" label="View large map" values={labels.routePanel.viewLargeMap} />
        <LocaleFields prefix="routeOpenGoogleMaps" label="Open Google Maps" values={labels.routePanel.openGoogleMaps} />
        <LocaleFields prefix="routeViewOnMap" label="View on map" values={labels.routePanel.viewOnMap} />
        <LocaleFields prefix="routePickupPoint" label="Main pickup point" values={labels.routePanel.pickupPoint} />
        <LocaleFields prefix="routeDropoffPoint" label="Main drop-off point" values={labels.routePanel.dropoffPoint} />
        <LocaleFields prefix="routeArriveEarly" label="Arrive early" values={labels.routePanel.arriveEarly} />
        <LocaleFields prefix="routeMinutesBefore" label="Minutes before" values={labels.routePanel.minutesBefore} />
        <LocaleFields prefix="routeViewTripDetails" label="View trip details" values={labels.routePanel.viewTripDetails} />
        <LocaleFields prefix="routeSeatsLeft" label="Seats left template" values={labels.routePanel.seatsLeft} />
        <LocaleFields prefix="routePerPassenger" label="Per passenger" values={labels.routePanel.perPassenger} />
        <LocaleFields prefix="routeVerified" label="Verified" values={labels.routePanel.verified} />
      </div>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Save UI labels
      </button>
    </form>
  );
}
