// HomePage.js
import React from "react";
import {Card} from "@/components/ui/card.tsx";
import {useTranslation} from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link } from "react-router-dom";


export function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <ScrollArea className="rounded-md border h-40 text-left">
                <div className="flex flex-col space-y-4 p-6 pb-3">
                    <h3 className="font-semibold leading-none tracking-tight text-base">{("introduce")}</h3>
                    <p className="text-sm max-w-lg text-balance leading-relaxed">
                        {(" HTML code goes here fhdsfhdsfhodisfhodisfhoidfhdiosfh doisfhdoifhdsoifhdosif  fiodsjhfoidshfoidh fd dsfhdsoifhdsoif jdsoif hdsoifhd  fdiofh dosifjdosifj dsfd sfdsoifjdsoi jdoi fd oi fdjsoifdjofidjoi dso  df dsofd oi do fd fdjfds fjdf dsf df doif jdoifjdsoifjdsoi jdsof dsoi fdsof dsif dsof doisfjdsoif jdiosfjdsoi fdjfhdjksf fjdjfl ")}
                    </p>
                </div>
            </ScrollArea>
            <ScrollArea className="text-left">
                <div className="flex flex-col space-y-4 p-6 pb-3">
                    <h3 className="font-semibold leading-none tracking-tight text-base">{("introduce")}</h3>
                    <p className="text-sm max-w-lg leading-relaxed">
                        {(" Hi, I'm Snippet, your personal guide to the world of websites!🎉 ")}
                    </p>
                    <p className="text-sm max-w-lg  leading-relaxed">
                        I'm here to help you explore, understand, and even play with the building blocks of any website. To get started select a component on your screen or click 
                        <a href="/introduction" className="text-blue-500 underline">
                            here
                        </a> for our introductory docs
                    </p>
                </div>
            </ScrollArea>
        </div>

    )
}
