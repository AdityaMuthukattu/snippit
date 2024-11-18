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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Crosshair } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-markup";

export default () => {
  const [showContent, setShowContent] = useState(true);
  const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.home);
  const [headTitle, setHeadTitle] = useState("home");
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isPicking, setIsPicking] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const isPickingRef = useRef(false);
  const lastHighlightedRef = useRef<HTMLElement | null>(null);

  async function initI18n() {
    let data = await browser.storage.local.get("i18n");
    if (data.i18n) {
      await i18n.changeLanguage(data.i18n);
    }
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isPickingRef.current) return;

    // Remove highlight from previous element
    if (lastHighlightedRef.current) {
      lastHighlightedRef.current.style.outline = "";
    }

    // Highlight new element
    const element = event.target as HTMLElement;
    element.style.outline = "2px solid #3b82f6";
    lastHighlightedRef.current = element;
  }

  function handleClick(event: MouseEvent) {
    if (!isPickingRef.current) return;

    event.preventDefault();
    event.stopPropagation();

    const element = event.target as HTMLElement;

    // Send the selected element's details
    const message = new ExtMessage(MessageType.html);
    message.content = element.outerHTML;
    message.from = MessageFrom.contentScript;
    browser.runtime.sendMessage(message);

    // Update selected element for display
    setSelectedElement(element.outerHTML);

    // Clean up and exit picking mode
    stopPicking();
  }

  function startPicking() {
    isPickingRef.current = true;
    setIsPicking(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick, true);
    document.body.style.cursor = "crosshair";
    setSelectedElement(null);
  }

  function stopPicking() {
    isPickingRef.current = false;
    setIsPicking(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("click", handleClick, true);
    document.body.style.cursor = "";

    // Remove any remaining highlight
    if (lastHighlightedRef.current) {
      lastHighlightedRef.current.style.outline = "";
      lastHighlightedRef.current = null;
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isPicking) {
        stopPicking();
      }
    };
  }, [isPicking]);

  // Listen for messages from extension
  useEffect(() => {
    const handleMessage = async (message: ExtMessage) => {
      console.log("Content script received message:", message);
      if (message.messageType === MessageType.clickExtIcon) {
        if (message.content === "pick") {
          startPicking();
          console.log("start picking");
        } else if (message.content === "cancel") {
          stopPicking();
          console.log("cancel");
        }
      } else if (message.messageType === MessageType.changeLocale) {
        i18n.changeLanguage(message.content);
      } else if (message.messageType === MessageType.changeTheme) {
        toggleTheme(message.content);
      }
    };

    browser.runtime.onMessage.addListener(handleMessage);
    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  // Highlight code when selected element changes
  useEffect(() => {
    if (selectedElement) {
      Prism.highlightAll();
    }
  }, [selectedElement]);

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
            {sidebarType === SidebarType.home && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Element Picker</CardTitle>
                  <CardDescription>
                    Click to select an element on the page
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={startPicking}
                    disabled={isPicking}
                    className="w-full"
                  >
                    <Crosshair className="mr-2 h-4 w-4" />
                    {isPicking ? "Picking..." : "Start Picking"}
                  </Button>
                </CardContent>
                {selectedElement && (
                  <CardFooter className="flex flex-col items-start">
                    <h3 className="text-sm font-semibold mb-2">
                      Selected Element:
                    </h3>
                    <div className="w-full max-h-96 overflow-auto rounded-md bg-zinc-950 p-4">
                      <pre className="language-markup">
                        <code>{selectedElement}</code>
                      </pre>
                    </div>
                  </CardFooter>
                )}
              </Card>
            )}
            {sidebarType === SidebarType.settings && <SettingsPage />}
          </main>
        </div>
      )}
    </div>
  );
};
