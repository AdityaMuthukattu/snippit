// HomePage.js
import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ExtMessage, { MessageType, MessageFrom } from "@/entrypoints/types.ts";

import OpenAI from "openai";

// Instantiate OpenAI outside of the component
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export function Home() {
  const [text, setText] = useState("");
  useEffect(() => {
    const handleMessage = async (message: ExtMessage) => {
      if (message.messageType === MessageType.html) {
        if (message.content) {
          setText(message.content);
        }
      }
    };

    browser.runtime.onMessage.addListener(handleMessage);

    // Cleanup listener on component unmount
    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const startPicker = async () => {
    await browser.runtime.sendMessage({
      messageType: MessageType.clickExtIcon,
      content: "pick",
    });
  };
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState("");
  const [inputs, setInputs] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant with deep knowledge of HTML, CSS, JavaScript, and Web Technology. You will help the user answer their questions about how websites work.",
          },
          {
            role: "user",
            content: inputValue,
          },
        ],
      });

      const newResponse =
        res.choices[0]?.message?.content || "No response from model";
      setResponse(newResponse);
      setInputs([...inputs, inputValue]);
      setResponses([...responses, newResponse]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex flex-col max-h-screen">
      <div className="flex flex-col gap-2 pb-5 max-h-[80%]">
        {" "}
        {/* Added padding bottom here */}
        <div className="flex flex-row flex-grow space-x-4 px-4 py-2">
          <Button
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            onClick={startPicker}
          >
            Picker
          </Button>
          <Button
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => console.log("Refresh Page clicked")}
          >
            Clear Chat
          </Button>
        </div>
        <ScrollArea className="rounded-md border h-60 overflow-auto p-4">
          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold leading-none tracking-tight text-base">
              {"Introduction"}
            </h3>
            <code className="language-html whitespace-pre-wrap break-words pr-3">
              {text}
            </code>
          </div>
        </ScrollArea>
        <ScrollArea className=" flex-grow overflow-auto p-4">
          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold leading-none tracking-tight text-base">
              {"Introduction"}
            </h3>
            <p className="text-sm max-w-lg leading-relaxed">
              {
                "Hi, I'm Snippet, your personal guide to the world of websites!🎉"
              }
            </p>
            <p className="text-sm max-w-lg leading-relaxed">
              {
                "I'm here to help you explore, understand, and even play with the building blocks of any website. To get started select a component on your screen"
              }
            </p>
            {responses.map((response, index) => (
              <div key={index} className="mt-4">
                <p className="text-sm max-w-lg">
                  Q: <b>{inputs[index]}</b>
                </p>
                <p className="text-sm max-w-lg">A: {response}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="fixed bottom-0 left-0 w-full px-4 py-4 bg-white border-t">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row items-center space-x-2">
            <Input
              className="flex-grow border rounded p-2"
              type="text"
              placeholder="Ask Snippet a question"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button
              className="ml-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
