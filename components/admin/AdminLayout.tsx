"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronRight,
  Globe2,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  UserCircle,
  X,
} from "lucide-react";
import { logoutAdminAction } from "@/lib/actions/auth";
import {
  adminLocalizedHref,
  localeLabels,
  setAdminLocale,
  supportedLocales,
  useAdminCopy,
  useAdminLocale,
  type Locale,
} from "@/components/admin/admin-i18n";
import { adminModules, type AdminModuleKey } from "@/components/admin/AdminModuleChrome";

type AdminUser = {
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
};

const adminModuleGroups = ["Operate", "Supply", "Revenue", "Trust", "Content"] as const;
const sidebarStorageKey = "vnbus-admin-sidebar";
const sidebarStorageEvent = "vnbus-admin-sidebar-change";

function subscribeSidebarStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(sidebarStorageEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(sidebarStorageEvent, onStoreChange);
  };
}

function getSidebarSnapshot() {
  return window.localStorage.getItem(sidebarStorageKey) === "collapsed";
}

function getServerSidebarSnapshot() {
  return false;
}

export function AdminLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AdminUser | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useAdminLocale();
  const copy = useAdminCopy();
  const sidebarCollapsed = useSyncExternalStore(
    subscribeSidebarStorage,
    getSidebarSnapshot,
    getServerSidebarSnapshot,
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isAdminLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isAdminLoginPage && !user) {
      router.replace("/admin/login");
    }
  }, [isAdminLoginPage, router, user]);

  if (isAdminLoginPage) {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="section-space">
        <div className="container-shell">
          <div className="card-surface p-8 text-sm text-slate-500">Redirecting to admin login...</div>
        </div>
      </div>
    );
  }

  const activeModule = adminModules
    .filter((module) => pathname === module.href || (module.href !== "/admin" && pathname?.startsWith(module.href.split("?")[0])))
    .at(-1)?.key ?? "dashboard";
  const activeModuleConfig = adminModules.find((module) => module.key === activeModule) ?? adminModules[0];
  const ActiveIcon = activeModuleConfig.icon;
  const activeModuleLabel = copy.modules[activeModule] ?? activeModuleConfig.label;
  const activeGroupLabel = copy.groups[activeModuleConfig.group] ?? activeModuleConfig.group;

  const toggleSidebar = () => {
    window.localStorage.setItem(sidebarStorageKey, sidebarCollapsed ? "expanded" : "collapsed");
    window.dispatchEvent(new Event(sidebarStorageEvent));
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-ink lg:flex">
      <AdminSidebar
        activeModule={activeModule}
        collapsed={sidebarCollapsed}
        locale={locale}
        user={user}
        onToggleCollapsed={toggleSidebar}
      />

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close admin navigation"
            className="absolute inset-0 bg-slate-950/35"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative h-full w-[min(86vw,320px)] border-r border-slate-200 bg-white shadow-2xl">
            <AdminSidebar
              activeModule={activeModule}
              collapsed={false}
              locale={locale}
              mobile
              user={user}
              onCloseMobile={() => setMobileSidebarOpen(false)}
              onToggleCollapsed={toggleSidebar}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="flex min-h-[64px] items-center gap-3 px-4 lg:px-6">
            <button
              type="button"
              aria-label={copy.openNavigation}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex min-w-0 items-center gap-3">
              <span className="hidden h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 sm:flex">
                <ActiveIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{activeGroupLabel}</p>
                <h1 className="truncate text-base font-black text-ink sm:text-lg">{activeModuleLabel}</h1>
              </div>
            </div>

            <div className="ml-auto hidden min-w-[260px] items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 xl:flex">
              <Search className="h-4 w-4 text-slate-400" />
              <span className="ml-2 text-sm font-semibold text-slate-400">{copy.searchAdminModules}</span>
            </div>

            <AdminLanguageSwitcher />

            <div className="ml-auto flex items-center gap-2 lg:hidden">
              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 md:flex">
                <UserCircle className="h-4 w-4 text-slate-500" />
                <div className="leading-tight">
                  <p className="text-xs font-black text-slate-800">{user.name}</p>
                  <p className="text-[11px] font-semibold text-slate-500">{user.role}</p>
                </div>
              </div>
              <form action={logoutAdminAction}>
                <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{copy.signOut}</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-6 lg:py-8">
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

function AdminLanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useAdminLocale();
  const copy = useAdminCopy();

  const switchHref = (nextLocale: Locale) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextLocale === "en") {
      params.delete("lang");
    } else {
      params.set("lang", nextLocale);
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <div className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 lg:flex" aria-label={copy.language}>
      <Globe2 className="ml-2 h-4 w-4 text-slate-500" />
      {supportedLocales.map((item) => (
        <Link
          key={item}
          href={switchHref(item)}
          onClick={() => setAdminLocale(item)}
          className={`rounded-lg px-2.5 py-2 text-xs font-black transition ${
            locale === item ? "bg-white text-brand-700 shadow-sm" : "text-slate-500 hover:bg-white hover:text-ink"
          }`}
        >
          {localeLabels[item]}
        </Link>
      ))}
    </div>
  );
}

function AdminSidebar({
  activeModule,
  collapsed,
  locale,
  mobile = false,
  user,
  onCloseMobile,
  onToggleCollapsed,
}: {
  activeModule: AdminModuleKey;
  collapsed: boolean;
  locale: Locale;
  mobile?: boolean;
  user: AdminUser;
  onCloseMobile?: () => void;
  onToggleCollapsed: () => void;
}) {
  const copy = useAdminCopy();

  return (
    <aside
      className={`${
        mobile ? "flex h-full w-full" : "hidden lg:sticky lg:top-0 lg:flex lg:h-screen"
      } flex-col border-r border-slate-200 bg-white transition-[width] duration-200 ${collapsed && !mobile ? "lg:w-[76px]" : "lg:w-[288px]"}`}
    >
      <div className={`relative flex items-center gap-3 border-b border-slate-100 ${collapsed && !mobile ? "min-h-[104px] flex-col justify-center px-3 py-3" : "min-h-[64px] px-4"}`}>
        <Link href={adminLocalizedHref("/admin", locale)} className="flex min-w-0 items-center gap-3" aria-label="VNBus Admin dashboard">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-sm font-black text-white">VN</span>
          {!collapsed || mobile ? (
            <span className="min-w-0">
              <span className="block truncate text-base font-black text-ink">VNBus Admin</span>
              <span className="block truncate text-[11px] font-semibold text-slate-500">{copy.operationsConsole}</span>
            </span>
          ) : null}
        </Link>

        {mobile ? (
          <button
            type="button"
            aria-label={copy.closeNavigation}
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            onClick={onCloseMobile}
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            aria-label={collapsed ? copy.expandSidebar : copy.collapseSidebar}
            aria-expanded={!collapsed}
            className={`${collapsed ? "" : "ml-auto"} hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 lg:inline-flex`}
            onClick={onToggleCollapsed}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        )}
      </div>

      <AdminNavList activeModule={activeModule} collapsed={collapsed && !mobile} locale={locale} onNavigate={mobile ? onCloseMobile : undefined} />

      <div className={`mt-auto border-t border-slate-100 p-3 ${collapsed && !mobile ? "space-y-2" : "space-y-3"}`}>
        {collapsed && !mobile ? (
          <div className="flex justify-center">
            <span title={`${user.name} - ${user.role}`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-700">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 shrink-0 text-slate-500" />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-black text-slate-800">{user.name}</p>
                <p className="truncate text-xs font-semibold text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <form action={logoutAdminAction}>
          <button
            type="submit"
            className={`inline-flex h-10 w-full items-center rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50 ${
              collapsed && !mobile ? "justify-center px-0" : "justify-between px-3"
            }`}
            title="Sign out"
          >
            {collapsed && !mobile ? null : <span>{copy.signOut}</span>}
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}

function AdminNavList({
  activeModule,
  collapsed,
  locale,
  onNavigate,
}: {
  activeModule: AdminModuleKey;
  collapsed: boolean;
  locale: Locale;
  onNavigate?: () => void;
}) {
  const copy = useAdminCopy();

  return (
    <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
      {adminModuleGroups.map((group) => {
        const modules = adminModules.filter((module) => module.group === group);
        return (
          <div key={group} className="mb-4 last:mb-0">
            {collapsed ? (
              <div className="mx-auto mb-2 h-px w-8 bg-slate-200" />
            ) : (
              <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{copy.groups[group] ?? group}</p>
            )}
            <div className="space-y-1">
              {modules.map((module) => {
                const Icon = module.icon;
                const active = activeModule === module.key;
                return (
                  <Link
                    key={module.key}
                    href={adminLocalizedHref(module.href, locale)}
                    title={copy.modules[module.key] ?? module.label}
                    onClick={onNavigate}
                    className={`flex min-h-11 items-center rounded-xl text-sm font-black transition ${
                      collapsed ? "justify-center px-0" : "gap-3 px-3"
                    } ${
                      active
                        ? "bg-brand-600 text-white shadow-[0_12px_24px_rgba(47,103,246,0.20)]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {collapsed ? null : <span className="truncate">{copy.modules[module.key] ?? module.label}</span>}
                    {!collapsed && active ? <ChevronRight className="ml-auto h-4 w-4" /> : null}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

    </nav>
  );
}
