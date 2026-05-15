"use client";

import { useSyncExternalStore } from "react";

const URL_CHANGE_EVENT = "vnbus:urlchange";

type PatchedHistory = History & {
  __vnbusUrlPatched?: boolean;
};

function emitUrlChange() {
  window.setTimeout(() => {
    window.dispatchEvent(new Event(URL_CHANGE_EVENT));
  }, 0);
}

function patchHistory() {
  if (typeof window === "undefined") return;

  const history = window.history as PatchedHistory;
  if (history.__vnbusUrlPatched) return;

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function pushState(...args) {
    const result = originalPushState.apply(this, args);
    emitUrlChange();
    return result;
  };

  history.replaceState = function replaceState(...args) {
    const result = originalReplaceState.apply(this, args);
    emitUrlChange();
    return result;
  };

  history.__vnbusUrlPatched = true;
}

function subscribe(callback: () => void) {
  patchHistory();
  window.addEventListener("popstate", callback);
  window.addEventListener(URL_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(URL_CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  return typeof window === "undefined" ? "" : window.location.search;
}

export function useUrlSearch() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "");
}
