// HomePage.js
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button";

export function Home() {
  const [wizardUrl, setWizardUrl] = useState("");
  useEffect(() => {
    const url = browser.runtime.getURL("/wizard.html");
    setWizardUrl(url);
  }, []);
  const references = [
    {
      name: "Wxt",
      url: "https://wxt.dev/",
    },
    {
      name: "React",
      url: "https://react.dev/",
    },
    {
      name: "Tailwind css",
      url: "https://tailwindcss.com/",
    },
    {
      name: "Shadcn UI",
      url: "https://ui.shadcn.com/",
    },
  ];
  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-4 min-h-screen p-4">
        <h1 className="text-xl font-bold">Welcome to the Extension</h1>
        <p className="text-base">Click the button below to start the wizard.</p>
        <a href={wizardUrl} target="_blank" rel="noopener noreferrer">
          <Button className="bg-blue-500 text-white py-2 px-4 rounded">
            Start Wizard
          </Button>
        </a>
      </div>
      <Card className="text-left">
        <div className="flex flex-col space-y-1.5 p-6 pb-3">
          <h3 className="font-semibold leading-none tracking-tight text-base">
            {"content-intro"}
          </h3>
          <p className="text-sm max-w-lg text-balance leading-relaxed">
            {"content-description"}
          </p>
        </div>
      </Card>
      <Card className="text-left">
        <div className="flex flex-col space-y-1.5 p-6 pb-3">
          <h3 className="font-semibold leading-none tracking-tight text-base">
            {"yoloSwag"}
          </h3>
          <div className="flex flex-col gap-4 pt-2">
            {references.map((reference, index, array) => {
              return (
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {reference.name}
                  </p>
                  <a
                    className="text-sm text-muted-foreground"
                    href={reference.url}
                    target="_blank"
                  >
                    {reference.url}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
