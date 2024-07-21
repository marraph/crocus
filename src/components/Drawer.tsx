"use client";

import {NavigationItem, useNavigation} from "@marraph/daisy/components/navigationitem/NavigationItem";
import React, {useEffect, useRef} from "react";
import {CalendarDays, ClipboardList, Flower, LayoutDashboard, Moon, Search, SquarePlus, Timer} from "lucide-react";
import {cn} from "@/utils/cn";
import {ProfileContextMenu} from "@/components/contextmenus/ProfileContextMenu";
import {usePathname, useRouter} from "next/navigation";
import {SearchDialog} from "@/components/dialogs/SearchDialog";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {JoinTeamDialog} from "@/components/dialogs/JoinTeamDialog";
import {Input} from "@marraph/daisy/components/input/Input";
import {Shortcut} from "@marraph/daisy/components/shortcut/Shortcut";

export const Drawer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => {
    const router = useRouter();
    const pathSegments = usePathname().split('/');
    const { selectedItem, setSelectedItem } = useNavigation();
    const joinTeamDialogRef = useRef<DialogRef>(null);
    const searchDialogRef = useRef<DialogRef>(null);

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
            <JoinTeamDialog ref={joinTeamDialogRef}/>
            <SearchDialog ref={searchDialogRef}/>

            <div className={cn("w-max h-screen flex flex-col justify-between bg-black pt-4 px-4 pb-8")} {...props}>
                <div className={"space-y-2"}>
                    <div className={"flex flex-row space-x-4 items-center mb-7"}>
                        <Flower size={30}/>
                        <span className={"text-3xl"}>fleur</span>
                    </div>

                    <div className={"h-8 group flex flex-row justify-between items-center rounded-lg bg-black border border-edge cursor-pointer pr-1"}
                        onClick={() => searchDialogRef.current?.showModal()}>
                        <div className={"flex flex-row items-center text-marcador text-sm space-x-2"}>
                            <Search size={18} className={"group-focus:text-white ml-2"}/>
                            <span>{"Search"}</span>
                        </div>
                        <Shortcut text={"⌘ K"}/>
                    </div>

                    <div className={"space-y-1 pt-4"}>
                        <span className={cn("text-marcador text-xs px-1")}>{"MENU"}</span>
                        <NavigationItem selected={selectedItem === "Dashboard"}
                                        title={"Dashboard"}
                                        onClick={() => router.push("/dashboard")}
                                        icon={<LayoutDashboard size={18}/>}
                        />
                        <NavigationItem selected={selectedItem === "Tasks"}
                                        title={"Tasks"}
                                        onClick={() => router.push("/tasks")}
                                        icon={<ClipboardList size={18}/>}
                        />
                        <NavigationItem selected={selectedItem === "Timetracking"}
                                        title={"Timetracking"}
                                        onClick={() => router.push("/timetracking")}
                                        icon={<Timer size={18}/>}
                        />
                        <NavigationItem selected={selectedItem === "Calendar"}
                                        title={"Calendar"}
                                        onClick={() => router.push("/calendar")}
                                        icon={<CalendarDays size={18}/>}
                        />
                    </div>

                    <div className={"py-12"}>
                        <span className={cn("text-marcador text-xs px-1")}>{"TEAMS"}</span>
                        <NavigationItem selected={false}
                                        title={"Join a team"}
                                        icon={<SquarePlus size={18}/>}
                                        onClick={() => joinTeamDialogRef.current?.show()}
                        />
                    </div>
                </div>
                <ProfileContextMenu/>
            </div>
        </>
    );
});
Drawer.displayName = "Drawer";