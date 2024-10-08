"use client";

import React, {HTMLAttributes, useEffect, useRef, useState} from "react";
import {
    CalendarDays,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Flower,
    LayoutDashboard,
    Plus,
    Timer
} from "lucide-react";
import {cn} from "@/utils/cn";
import {ProfileContextMenu} from "@/components/contextmenus/ProfileContextMenu";
import {usePathname, useRouter} from "next/navigation";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {JoinTeamDialog} from "@/components/dialogs/JoinTeamDialog";
import {useUser} from "@/context/UserContext";
import {NavigationItem, useNavigation} from "@/components/NavigationItem";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";

export const Drawer: React.FC<HTMLAttributes<HTMLDivElement>> = ({className, ...props}) => {
    const router = useRouter();
    const pathSegments = usePathname().split('/');
    const [openTeamMenu, setOpenTeamMenu] = useState(false);
    const joinTeamDialogRef = useRef<DialogRef>(null);
    const { selectedItem, setSelectedItem } = useNavigation();
    const { addTooltip, removeTooltip } = useTooltip();
    const { user, organisations, teams, loading, error, actions } = useUser();

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

    if (!user) return null;

    return (
        <>
            <JoinTeamDialog ref={joinTeamDialogRef}/>

            <div className={cn("w-max h-screen flex flex-col justify-between bg-zinc-100 dark:bg-black-light border-r border-zinc-300 dark:border-edge py-4")} {...props}>
                <div className={"space-y-2"}>
                    <div className={"flex flex-row space-x-4 items-center mb-7 border-b border-zinc-300 dark:border-edge px-4 pb-3"}>
                        <Flower size={30} className={"text-zinc-800 dark:text-white"}/>
                        <span className={"text-zinc-800 dark:text-white text-3xl"}>calla</span>
                    </div>

                    <div className={"space-y-1 pt-4 px-4"}>
                        <span className={cn("text-zinc-400 dark:text-marcador text-xs px-1")}>{"MENU"}</span>
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

                    <div className={"py-10 pl-2 pr-4 space-y-1"}>
                        <div className={"w-full flex flex-row items-center"}>
                            <div className={"w-full flex flex-row items-center justify-between p-2 pr-4 text-zinc-400 dark:text-marcador rounded-lg " +
                                "hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-dark cursor-pointer"}
                                onClick={() => setOpenTeamMenu(!openTeamMenu)}
                            >
                                <div className={"flex flex-row space-x-2"}>
                                    <span className={cn("text-xs pl-1")}>{"TEAMS"}</span>
                                    {openTeamMenu ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                                </div>
                            </div>
                            <div className={"p-2 text-zinc-400 dark:text-marcador hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-dark rounded-lg cursor-pointer"}
                                 onClick={() => joinTeamDialogRef.current?.show()}
                                 onMouseEnter={(e) => {
                                     addTooltip({
                                         message: "Join a team",
                                         anchor: "rc",
                                         trigger: e.currentTarget.getBoundingClientRect()
                                     });
                                 }}
                                 onMouseLeave={() => removeTooltip()}
                            >
                                <Plus size={16}/>
                            </div>
                        </div>

                        {openTeamMenu &&
                            <div className={"ml-6 pl-4 border-l border-zinc-300 dark:border-edge border-opacity-50"}>
                                {teams.map((team) => (
                                    <div key={team.id}
                                         className={cn("w-full text-zinc-500 dark:text-gray px-2 py-2 text-sm rounded-lg cursor-pointer truncate " +
                                             "hover:bg-zinc-200 dark:hover:bg-dark hover:text-zinc-800 dark:hover:text-white")}
                                    >
                                        <span>{team.name}</span>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                <ProfileContextMenu/>
            </div>
        </>
    );
}
