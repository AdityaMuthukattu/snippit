// HomePage.js
import React from "react";
import {Card} from "@/components/ui/card.tsx";
import {useTranslation} from "react-i18next";

export function Home() {
    return (
        <div className="grid gap-4">
            <Card className="text-left">
                <div className="flex flex-col space-y-1.5 p-6 pb-3">
                    <h3 className="font-semibold leading-none tracking-tight text-base">{("introduce")}</h3>
                    <p className="text-sm max-w-lg text-balance leading-relaxed">
                        {("description")}
                    </p>
                </div>
            </Card>
            <Card className="text-left">
                <div className="flex flex-col space-y-1.5 p-6 pb-3">
                    <p> Click this <a href="/dashboard.html">link</a></p>
                </div>
            </Card>
        </div>

    )
}









