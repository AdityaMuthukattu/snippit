import React from "react";
import {ThemeSettings} from "@/components/settings/theme-settings.tsx";
import {I18nSettings} from "@/components/settings/i18n-settings.tsx";
import {IoMdArrowBack} from "react-icons/io";

enum SidebarType {
  "home" = "Snippit",
  "settings" = "settings",
}

export function SettingsPage({onNavigate}: {onNavigate: (type: SidebarType) => void}) {
  return (
    <div className="flex flex-col h-screen w-full bg-zinc-50 dark:bg-zinc-900 relative">
      {/* Header with back button */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <button 
          className="p-2 -ml-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          onClick={() => onNavigate(SidebarType.home)}
        >
          <IoMdArrowBack className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-zinc-900 dark:text-zinc-100">Settings</h1>
      </div>

      {/* Settings content */}
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <I18nSettings />
          <ThemeSettings />
        </div>
      </div>
    </div>
  );
}
