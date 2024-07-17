"use client";

import {NavigationItem, useNavigation} from "@marraph/daisy/components/navigationitem/NavigationItem";
import React, {useEffect, useRef} from "react";
import {CalendarDays, ClipboardList, LayoutDashboard, Moon, Search, SquarePlus, Timer} from "lucide-react";
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

            <div className={cn("w-min h-screen flex flex-col justify-between bg-black pt-4 pr-5 pl-4")} {...props}>
                <div className={"space-y-2"}>
                    <div className={"flex flex-row space-x-4 items-center mb-7"}>
                        <Moon size={30}/>
                        <span className={"text-3xl"}>Luna</span>
                    </div>

                    <div
                        className={"group flex flex-row justify-between items-center space-x-1 rounded-lg bg-black border border-edge focus:text-white pr-1"}
                        onClick={() => searchDialogRef.current?.showModal()}>
                        <div className={"flex flex-row items-center"}>
                            <Search size={18} className={"group-focus:text-white text-marcador ml-2 mr-2"}/>
                            <Input placeholder={"Search"} border={"none"}
                                   className={"w-max text-sm m-0 p-0 h-8 bg-black"}></Input>
                        </div>
                        <Shortcut text={"⌘ K"} className={"justify-end"}/>
                    </div>

                    <div className={"space-y-1 pt-4"}>
                        <span className={cn("text-marcador text-xs px-1")}>{"MENU"}</span>
                        <NavigationItem selected={selectedItem === "Dashboard"}
                                        title={"Dashboard"}
                                        onClick={() => router.push("/dashboard")}
                                        icon={<LayoutDashboard size={18}/>}/>

                        <NavigationItem selected={selectedItem === "Tasks"}
                                        title={"Tasks"}
                                        onClick={() => router.push("/tasks")}
                                        icon={<ClipboardList size={18}/>}/>

                        <NavigationItem selected={selectedItem === "Timetracking"}
                                        title={"Timetracking"}
                                        onClick={() => router.push("/timetracking")}
                                        icon={<Timer size={18}/>}/>

                        <NavigationItem selected={selectedItem === "Calendar"}
                                        title={"Calendar"}
                                        onClick={() => router.push("/calendar")}
                                        icon={<CalendarDays size={18}/>}/>
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