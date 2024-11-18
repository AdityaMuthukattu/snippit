// HomePage.js
import React, { useState, useEffect, useRef } from "react";
import { browser } from "wxt/browser";
import ExtMessage, { MessageType, MessageFrom } from "@/entrypoints/types.ts";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crosshair } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-markup";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import styles from "./CodeSnippet.module.css";
import { IoIosSettings } from "react-icons/io";
import { RiDashboardFill } from "react-icons/ri";

// Instantiate OpenAI outside of the component
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

enum SidebarType {
  "home" = "Snippit",
  "settings" = "settings",
}

interface ChatResponse {
  input: string;
  response: string;
}

export function Home({
  onNavigate,
}: {
  onNavigate: (type: SidebarType) => void;
}) {
  const [text, setText] = useState("");
  const [isPicking, setIsPicking] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState("");
  const [inputs, setInputs] = useState<string[]>([]);
  const [responses, setResponses] = useState<ChatResponse[]>([]);

  let context =
    "You are a helpful assistant with deep knowledge of HTML, CSS, JavaScript, and Web Technology. You will help the user answer their questions about how websites work.";
  let prompt = `The following text is a snippet of HTML the user the user has picked using an element picker, and may have questions about ${text}. The following is the user's input ${inputValue}. Provide a clear and concise explanation/answer to the user's question`;

  useEffect(() => {
    const handleMessage = async (message: ExtMessage) => {
      if (message.messageType === MessageType.html) {
        if (message.content) {
          setText(message.content);
          setIsPicking(false);
        }
      }
    };

    browser.runtime.onMessage.addListener(handleMessage);

    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const startPicker = async () => {
    if (isPicking) {
      setIsPicking(false);
      const message = new ExtMessage(MessageType.clickExtIcon);
      message.content = "cancel";
      message.from = MessageFrom.sidePanel;
      console.log("Sending cancel message:", message);
      await browser.runtime.sendMessage(message);
      console.log("Cancel message sent");
    } else {
      setIsPicking(true);
      const message = new ExtMessage(MessageType.clickExtIcon);
      message.content = "pick";
      message.from = MessageFrom.sidePanel;
      console.log("Sending pick message:", message);
      await browser.runtime.sendMessage(message);
      console.log("Pick message sent");
    }
  };

  // Highlight code when text changes
  useEffect(() => {
    if (text) {
      Prism.highlightAll();
    }
  }, [text]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: context,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const newResponse =
        res.choices[0]?.message?.content || "No response from model";
      setResponse(newResponse);
      setInputs([...inputs, inputValue]);
      setResponses([
        ...responses,
        { input: inputValue, response: newResponse },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-50 dark:bg-zinc-900 relative">
      {/* Header with navigation */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <button
          className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
          onClick={() => onNavigate(SidebarType.home)}
        >
          <RiDashboardFill className="h-5 w-5 text-indigo-600" />
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            Snippit
          </span>
        </button>
        <button
          className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          onClick={() => onNavigate(SidebarType.settings)}
        >
          <IoIosSettings className="h-5 w-5" />
        </button>
      </div>

      {/* Top section with fixed height */}
      <div className="flex flex-col gap-6 p-6">
        {/* Buttons */}
        <div className="flex flex-row space-x-3">
          <Button
            className="flex-1 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2.5 shadow-sm transition-colors"
            onClick={startPicker}
          >
            <Crosshair
              className={`mr-2 h-4 w-4 ${isPicking ? "text-red-200" : ""}`}
            />
            <span className="truncate">
              {isPicking ? "Cancel Picking" : "Pick Element"}
            </span>
          </Button>
          <Button
            variant="outline"
            className="flex-1 font-medium rounded-lg border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            onClick={() => console.log("Refresh Page clicked")}
          >
            Clear Chat
          </Button>
        </div>

        {/* Code snippet section */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Current Selection
            </h3>
            <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              HTML Snippet
            </span>
          </div>
          <div className="rounded-xl bg-zinc-900 dark:bg-black border border-zinc-800 shadow-lg">
            <div className="flex items-center px-4 py-2 border-b border-zinc-800">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
              </div>
            </div>
            <div
              className={`p-4 max-h-40 overflow-auto ${styles.codeContainer} w-full`}
              style={{ backgroundColor: "rgb(45, 45, 45)" }}
            >
              <div className={`${styles.codeWrapper} w-full`}>
                <pre className="text-sm w-full">
                  <code className="language-markup w-full">{text}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable chat section */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col space-y-6 px-6 pb-[84px]">
          {/* Welcome message */}
          <div className="space-y-3 pt-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Chat with Snippit
            </h3>
            <div className="space-y-3">
              <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Hi, I'm Snippet, your personal guide to the world of websites!
                🎉
              </p>
              <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                I'm here to help you explore and understand any website's
                building blocks. Select an element to get started!
              </p>
            </div>
          </div>

          {responses.map((response, index) => (
            <div
              key={index}
              className="space-y-3 p-4 rounded-lg bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="space-y-3">
                <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                  {response.input}
                </p>
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      code: ({ className, children, ...props }) => (
                        <code
                          className={`${styles.code} ${className || ''}`}
                          {...props}
                        >
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {response.response}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Fixed input form at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800 z-10">
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              className="flex-1 min-w-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg shadow-sm px-4 py-2"
              type="text"
              placeholder="Ask about this element..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button
              type="submit"
              className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 shadow-sm transition-colors"
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
