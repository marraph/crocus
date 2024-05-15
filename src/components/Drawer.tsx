"use client";

import {NavigationItem} from "@marraph/daisy/components/navigationitem/NavigationItem";
import React from "react";
import {CalendarDays, ClipboardList, LayoutDashboard, SquarePlus, Timer} from "lucide-react";
import {cn} from "@/utils/cn";
import {ProfileContext} from "@/components/contextmenus/ProfileContext";

export function Drawer() {

    return (
        <div className={cn("w-min h-screen flex flex-col justify-between bg-black pt-4 pr-5 pl-4")}>
            <div className={"space-y-2"}>
                <div className={"space-y-1"}>
                    <span className={cn("text-placeholder text-xs px-1")}>{"MENU"}</span>
                    <NavigationItem title={"Dashboard"} icon={<LayoutDashboard size={18}/>}/>
                    <NavigationItem title={"Tasks"} icon={<ClipboardList size={18}/>}/>
                    <NavigationItem title={"Timetracking"} icon={<Timer size={18}/>}/>
                    <NavigationItem title={"Calendar"} icon={<CalendarDays size={18}/>}/>
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