"use client";

import React from "react";
import {SunMedium} from "lucide-react";


export default function Dashboard() {
    return (
        <div className={"h-full flex flex-col justify-between"}>
            <div className={"pt-4"}>
                <span className={"text-xl"}>{"Good morning, Marius"}</span>
                <div className={"flex flex-row items-center space-x-2"}>
                    <SunMedium size={18} color="#fff04d" />
                    <span className={"text-gray"}>{"Wednesday, June 5"}</span>
                </div>
            </div>
            <div className={"flex flex-row items-center space-x-16 w-full h-1/2 pt-8 pb-16"}>
                <div className={"bg-black rounded-lg border border-white border-opacity-20 w-1/2 h-72"}>

                </div>
                <div className={"bg-black rounded-lg border border-white border-opacity-20 w-1/2 h-72"}>

                </div>
            </div>

            <div className={"bg-black rounded-lg border border-white border-opacity-20 w-full h-full"}>

            </div>
        </div>
    );
}