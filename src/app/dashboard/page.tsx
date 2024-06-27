"use client";

import React from "react";
import {SunMedium} from "lucide-react";
import {useUser} from "@/context/UserContext";


export default function Dashboard() {

    const {data:user, isLoading:userLoading, error:userError} = useUser();

    function parseDate(date: Date): string {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function getDayText(): string {
        let date = new Date();
        if (date.getHours() > 5 && date.getHours() < 11)  return "Good morning, ";
        if (date.getHours() > 11 && date.getHours() < 14)  return "Good noon, ";
        if (date.getHours() > 14 && date.getHours() < 18) return "Good afternoon, ";
        if (date.getHours() > 18 && date.getHours() < 22) return "Good evening, ";
        if (date.getHours() > 22 && date.getHours() < 5) return "Good night, ";
        else return "Welcome back, "
    }



    return (
        <div className={"h-full flex flex-col justify-between"}>
            <div className={"pt-4"}>
                <span className={"text-xl"}>{getDayText() + user?.name.split(' ')[0]}</span>
                <div className={"flex flex-row items-center space-x-2"}>
                    <SunMedium size={18} color="#fff04d" />
                    <span className={"text-gray"}>{parseDate(new Date())}</span>
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