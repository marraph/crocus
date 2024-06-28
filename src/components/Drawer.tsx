"use client";

import {NavigationItem, useNavigation} from "@marraph/daisy/components/navigationitem/NavigationItem";
import React, {useEffect, useRef} from "react";
import {CalendarDays, ClipboardList, LayoutDashboard, Moon, SquarePlus, Timer} from "lucide-react";
import {cn} from "@/utils/cn";
import {ProfileContextMenu} from "@/components/contextmenus/ProfileContextMenu";
import {usePathname, useRouter} from "next/navigation";
import {SearchField} from "@/components/SearchField";
import {User} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {JoinTeamDialog} from "@/components/dialogs/JoinTeamDialog";

export const Drawer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => {
    const router = useRouter();
    const pathSegments = usePathname().split('/');
    const { selectedItem, setSelectedItem } = useNavigation();
    const joinTeamDialogRef = useRef<DialogRef>(null);

    useEffect(() => {
        if (pathSegments.includes('dashboard')) {
            setSelectedItem('Dashboard');
        } else if (pathSegments.includes('tasks')) {
            setSelectedItem('Tasks');
        } else if (pathSegments.includes('timetracking')) {
            setSelectedItem('Timetracking');
        } else if (pathSegments.includes('calendar')) {
            setSelectedItem('Calendar');
        } else {
            setSelectedItem('');
        }
    }, [pathSegments, setSelectedItem]);

    return (
        <>
            <div className={cn("w-min h-screen flex flex-col justify-between bg-black pt-4 pr-5 pl-4")} {...props}>
                <div className={"space-y-2"}>
                    <div className={"flex flex-row space-x-4 items-center mb-7"}>
                        <Moon size={30}/>
                        <span className={"text-3xl"}>Luna</span>
                    </div>
                    <SearchField/>
                    <div className={"space-y-1 pt-4"}>
                        <span className={cn("text-placeholder text-xs px-1")}>{"MENU"}</span>
                        <NavigationItem selected={selectedItem === "Dashboard"}
                                        title={"Dashboard"}
                                        onClick={() =>  router.push("/dashboard")}
                                        icon={<LayoutDashboard size={18}/>}/>

                        <NavigationItem selected={selectedItem === "Tasks"}
                                        title={"Tasks"}
                                        onClick={() =>  router.push("/tasks")}
                                        icon={<ClipboardList size={18}/>}/>

                        <NavigationItem selected={selectedItem === "Timetracking"}
                                        title={"Timetracking"}
                                        onClick={() =>  router.push("/timetracking")}
                                        icon={<Timer size={18}/>}/>

                        <NavigationItem selected={selectedItem === "Calendar"}
                                        title={"Calendar"}
                                        onClick={() =>  router.push("/calendar")}
                                        icon={<CalendarDays size={18}/>}/>
                    </div>

                    <div className={"py-12"}>
                        <span className={cn("text-placeholder text-xs px-1")}>{"TEAMS"}</span>
                        <NavigationItem selected={false}
                                        title={"Join a team"}
                                        icon={<SquarePlus size={18}/>}
                                        onClick={() => joinTeamDialogRef.current?.show()}
                        />
                    </div>
                </div>
                <ProfileContextMenu/>
            </div>

            <JoinTeamDialog ref={joinTeamDialogRef}/>
        </>
  );
});
Drawer.displayName = "Drawer";