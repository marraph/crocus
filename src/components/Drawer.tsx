"use client";

import {NavigationItem} from "@marraph/daisy/components/navigationitem/NavigationItem";
import React, {useState} from "react";
import {CalendarDays, ClipboardList, LayoutDashboard, Moon, SquarePlus, Timer} from "lucide-react";
import {cn} from "@/utils/cn";
import {ProfileContextMenu} from "@/components/contextmenus/ProfileContextMenu";
import {useRouter} from "next/navigation";
import {SearchField} from "@/components/SearchField";

export function Drawer() {
    const router = useRouter();

    const [selectDashbaord, setSelectDashboard] = useState(false);
    const [selectTasks, setSelectTasks] = useState(false);
    const [selectTime, setSelectTime] = useState(false);
    const [selectCalendar, setSelectCalendar] = useState(false);

    return (
        <div className={cn("w-min h-screen flex flex-col justify-between bg-black pt-4 pr-5 pl-4")}>
            <div className={"space-y-2"}>
                <div className={"flex flex-row space-x-4 items-center mb-7"}>
                    <Moon size={30}/>
                    <span className={"text-3xl"}>Luna</span>
                </div>
                <SearchField/>
                <div className={"space-y-1 pt-4"}>
                    <span className={cn("text-placeholder text-xs px-1")}>{"MENU"}</span>
                    <NavigationItem selected={selectDashbaord} title={"Dashboard"}
                                    onClick={() => {router.push("/dashboard"); setSelectDashboard(true)}}
                                    icon={<LayoutDashboard size={18}/>}/>
                    <NavigationItem selected={selectTasks} title={"Tasks"}
                                    onClick={() => {router.push("/tasks"); setSelectTasks(true)}}
                                    icon={<ClipboardList size={18}/>}/>
                    <NavigationItem selected={selectTime} title={"Timetracking"}
                                    onClick={() => {router.push("/timetracking"); setSelectTime(true)}}
                                    icon={<Timer size={18}/>}/>
                    <NavigationItem selected={selectCalendar} title={"Calendar"}
                                    onClick={() => {router.push("/calendar"); setSelectCalendar(true)}}
                                    icon={<CalendarDays size={18}/>}/>
                </div>

                <div className={"py-12"}>
                    <span className={cn("text-placeholder text-xs px-1")}>{"TEAMS"}</span>
                    <NavigationItem selected={false} title={"Join a team"} icon={<SquarePlus size={18}/>}/>
                </div>
            </div>
            <ProfileContextMenu/>
        </div>
  );
}