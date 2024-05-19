"use client";

import {NavigationItem} from "@marraph/daisy/components/navigationitem/NavigationItem";
import React from "react";
import {CalendarDays, ClipboardList, LayoutDashboard, SquarePlus, Timer} from "lucide-react";
import {cn} from "@/utils/cn";
import {ProfileContext} from "@/components/contextmenus/ProfileContext";
import {useRouter} from "next/navigation";

export function Drawer() {
    const router = useRouter();

    return (
        <div className={cn("w-min h-screen flex flex-col justify-between bg-black pt-4 pr-5 pl-4")}>
            <div className={"space-y-2"}>
                <div className={"space-y-1"}>
                    <span className={cn("text-placeholder text-xs px-1")}>{"MENU"}</span>
                    <NavigationItem title={"Dashboard"} onClick={() => router.push("/dashboard")}
                                    icon={<LayoutDashboard size={18}/>}/>
                    <NavigationItem title={"Tasks"} onClick={() => router.push("/tasks")}
                                    icon={<ClipboardList size={18}/>}/>
                    <NavigationItem title={"Timetracking"} onClick={() => router.push("/timetracking")}
                                    icon={<Timer size={18}/>}/>
                    <NavigationItem title={"Calendar"} onClick={() => router.push("/calendar")}
                                    icon={<CalendarDays size={18}/>}/>
                </div>

                <div className={"py-12"}>
                    <span className={cn("text-placeholder text-xs px-1")}>{"TEAMS"}</span>
                    <NavigationItem title={"Join a team"} icon={<SquarePlus size={18}/>}/>
                </div>
            </div>
            <ProfileContext/>
        </div>
  );
}