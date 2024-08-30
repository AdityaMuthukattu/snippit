import React, { useEffect, useRef, useState } from "react";
import "./App.module.css";
import "../../assets/main.css";
import { Home } from "@/entrypoints/content/home.tsx";
import { SettingsPage } from "@/entrypoints/content/settings.tsx";
import Sidebar, { SidebarType } from "@/entrypoints/sidebar.tsx";
import { browser } from "wxt/browser";
import ExtMessage, { MessageType, MessageFrom } from "@/entrypoints/types.ts";
import Header from "@/entrypoints/content/header.tsx";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider.tsx";

export default () => {
  const [showContent, setShowContent] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.home);
  const [headTitle, setHeadTitle] = useState("home");
  const [buttonStyle, setButtonStyle] = useState<any>();
  const [cardStyle, setCardStyle] = useState<any>();
  const cardRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isPicking, setIsPicking] = useState(false);

  async function initI18n() {
    let data = await browser.storage.local.get("i18n");
    if (data.i18n) {
      await i18n.changeLanguage(data.i18n);
    }
  }

  function domLoaded() {
    console.log("dom loaded");
  }
  const livListener = (event: MouseEvent) => {
    const hoveredElement = event.target as HTMLElement;

    // Create or select the tooltip element
    let tooltip = document.getElementById("html-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "html-tooltip";
      document.body.appendChild(tooltip);
    }

    // Get and set the HTML content of the hovered element
    let elementHTML = "";
    if (hoveredElement) {
      elementHTML = hoveredElement.outerHTML;
    }
    tooltip.textContent = elementHTML;

    // Style and position the tooltip near the cursor
    tooltip.style.position = "fixed";
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
    tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    tooltip.style.color = "white";
    tooltip.style.padding = "5px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.zIndex = "10000";
    tooltip.style.maxWidth = "300px";
    tooltip.style.wordWrap = "break-word";
    tooltip.style.display = "block";
  };
  function liv2(e: MouseEvent) {
    // Hide the tooltip when the mouse moves out
    const tooltip = document.getElementById("html-tooltip");
    if (tooltip) {
      tooltip.style.display = "none";
    }
  }
  function livMode() {
    document.addEventListener("mouseover", livListener);
    document.addEventListener("mouseout", liv2);
    document.addEventListener("mouseover", highlightElement);
    document.addEventListener("mouseout", removeHighlight);
    document.addEventListener("click", selectElement);
  }
  function highlightElement(event: MouseEvent) {
    const element = event.target as HTMLElement;
    element.style.outline = "2px solid red";
  }

  function removeHighlight(event: MouseEvent) {
    const element = event.target as HTMLElement;
    element.style.outline = "";
  }

  function selectElement(event: MouseEvent) {
    console.log("selectElement called");
    event.preventDefault();
    event.stopPropagation();
    console.log("Event propagation stopped");
    const element = event.target as HTMLElement;
    // Send the selected element's details back
    const message = new ExtMessage(MessageType.html);
    message.content = element.outerHTML;
    message.from = MessageFrom.contentScript;

    browser.runtime.sendMessage(message);

    endPickingMode();
  }

  function endPickingMode() {
    document.removeEventListener("mouseover", livListener);
    // document.removeEventListener("mouseout", liv2);
    document.removeEventListener("mouseover", highlightElement);
    // document.removeEventListener("mouseout", removeHighlight);
    document.removeEventListener("click", selectElement);
    setIsPicking(false);
  }

  useEffect(() => {
    if (document.readyState === "complete") {
      // load event has already fired, run your code or function here
      console.log("dom complete");
      domLoaded();
    } else {
      // load event hasn't fired, listen for it
      window.addEventListener("load", () => {
        // your code here
        console.log("content load:");
        console.log(window.location.href);
        domLoaded();
      });
    }
    browser.runtime.onMessage.addListener(
      (message: ExtMessage, sender, sendResponse) => {
        console.log("content:");
        console.log(message);
        if (
          message.messageType === MessageType.clickExtIcon &&
          message.content === "pick"
        ) {
          // startPickingMode(); // Start the element picker mode
          livMode();
        } else if (message.messageType === MessageType.changeLocale) {
          i18n.changeLanguage(message.content);
        } else if (message.messageType === MessageType.changeTheme) {
          toggleTheme(message.content);
        }
      }
    );
  }, []);

  return (
    <div className={theme}>
      {showContent && (
        <div className="fixed top-0 right-0 h-screen w-[400px] bg-background z-[1000000000000] rounded-l-xl shadow-2xl">
          <Header headTitle={headTitle} />
          <Sidebar
            closeContent={() => {
              setShowContent(false);
            }}
            sideNav={(sidebarType: SidebarType) => {
              setSidebarType(sidebarType);
              setHeadTitle(sidebarType);
            }}
          />
          <main className="mr-14 grid gap-4 p-4">
            {sidebarType === SidebarType.home && <Home />}
            {sidebarType === SidebarType.settings && <SettingsPage />}
          </main>
        </div>
      )}
    </div>
  );
};
