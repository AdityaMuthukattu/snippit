import React, { useEffect, useRef, useState } from "react";
import "./App.module.css";
import "../../assets/main.css";
import { browser } from "wxt/browser";
import ExtMessage, { MessageType } from "@/entrypoints/types.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Home } from "@/entrypoints/sidepanel/home.tsx";
import { SettingsPage } from "@/entrypoints/sidepanel/settings.tsx";
import { useTheme } from "@/components/theme-provider.tsx";
import { useTranslation } from "react-i18next";

enum SidebarType {
  "home" = "Snippit",
  "settings" = "settings",
}

export default () => {
  const [showButton, setShowButton] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.home);
  const [headTitle, setHeadTitle] = useState("snippit");
  const [buttonStyle, setButtonStyle] = useState<any>();
  const [cardStyle, setCardStyle] = useState<any>();
  const cardRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  async function initI18n() {
    let data = await browser.storage.local.get("i18n");
    if (data.i18n) {
      await i18n.changeLanguage(data.i18n);
    }
  }

  useEffect(() => {
    browser.runtime.onMessage.addListener(
      (message: ExtMessage, sender, sendResponse) => {
        console.log("sidepanel:");
        console.log(message);
        if (message.messageType == MessageType.changeLocale) {
          i18n.changeLanguage(message.content);
        } else if (message.messageType == MessageType.changeTheme) {
          toggleTheme(message.content);
        }
      }
    );

    initI18n();
  }, []);

  const handleNavigation = (type: SidebarType) => {
    setSidebarType(type);
    setHeadTitle(type);
  };

  return (
    <div className={theme}>
      {
        <div className="fixed top-0 right-0 h-screen w-full bg-background z-[1000000000000] rounded-l-xl shadow-2xl">
          <main className="grid gap-4 p-4 md:gap-8">
            {sidebarType === SidebarType.home && <Home onNavigate={handleNavigation} />}
            {sidebarType === SidebarType.settings && <SettingsPage onNavigate={handleNavigation} />}
          </main>
        </div>
      }
      {showButton && (
        <Button className="absolute z-[100000]" style={buttonStyle}>
          send Message
        </Button>
      )}
      {
        <Card
          ref={cardRef}
          className={`absolute z-[100000] w-[300px] h-[200px] ${
            showCard ? "block" : "hidden"
          }`}
          style={cardStyle}
        ></Card>
      }
    </div>
  );
};
