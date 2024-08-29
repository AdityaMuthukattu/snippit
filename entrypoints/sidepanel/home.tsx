// HomePage.js
import React from "react";
import { Card } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function Home() {
  return (
    <div className="flex flex-col gap-2 min-h-screen">
      <Card className="text-left">
        <div className="space-y-1.5 p-6 pb-3 min-h-40">
          <p className="text-sm max-w-lg text-balance leading-relaxed">
            * viewport goes here *
          </p>
        </div>
      </Card>
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
