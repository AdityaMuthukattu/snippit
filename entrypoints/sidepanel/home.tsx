// HomePage.js
import React from "react";
import { Card } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ExtMessage, { MessageType, MessageFrom } from "@/entrypoints/types.ts";
export function Home() {
  const startPicker = async () => {
    await browser.runtime.sendMessage({
      messageType: MessageType.clickExtIcon,
      content: "pick",
    });
  };
  return (
    <div className="flex flex-col gap-2 min-h-screen">
      {/* Added Buttons */}
      <div className="flex space-x-4">
        <Button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          onClick={startPicker}
        >
          Picker
        </Button>
        <Button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
        <Button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => console.log("Clear Chat clicked")}
        >
          Clear Chat
        </Button>
      </div>
      <ScrollArea className="rounded-md border h-40 text-left">
        <div className="flex flex-col space-y-4 p-6 pb-3">
          <h3 className="font-semibold leading-none tracking-tight text-base">
            {"introduction"}
          </h3>
          <p className="text-sm max-w-lg text-balance leading-relaxed">
            {"HTML CODE GOES HERE"}
          </p>
        </div>
      </ScrollArea>
      <ScrollArea className="text-left">
        <div className="flex flex-col space-y-4 p-6 pb-3">
          <h3 className="font-semibold leading-none tracking-tight text-base">
            {"introduction"}
          </h3>
          <p className="text-sm max-w-lg leading-relaxed">
            {
              " Hi, I'm Snippet, your personal guide to the world of websites!🎉 "
            }
          </p>
          <p className="text-sm max-w-lg  leading-relaxed">
            {
              "I'm here to help you explore, understand, and even play with the building blocks of any website. To get started select a component on your screen"
            }
          </p>
        </div>
      </ScrollArea>
      <div className="mt-auto w-full px-4 pb-20">
        <div className="flex flex-row items-center space-x-2 w-full ">
          <Input
            className="flex-grow"
            type="text"
            placeholder="Ask Snippet a question"
          />
          <Button className="ml-auto" type="submit">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
