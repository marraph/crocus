"use client";

import React, {useEffect, useRef, useState} from "react";
import {
    CalendarDays,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Flower,
    LayoutDashboard,
    SquarePlus,
    Timer,
    Users
} from "lucide-react";
import {cn} from "@/utils/cn";
import {ProfileContextMenu} from "@/components/contextmenus/ProfileContextMenu";
import {usePathname, useRouter} from "next/navigation";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {JoinTeamDialog} from "@/components/dialogs/JoinTeamDialog";
import {useUser} from "@/context/UserContext";
import {NavigationItem, useNavigation} from "@/components/NavigationItem";

export const Drawer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => {
    const router = useRouter();
    const pathSegments = usePathname().split('/');
    const [openTeamMenu, setOpenTeamMenu] = useState(false);
    const joinTeamDialogRef = useRef<DialogRef>(null);
    const { selectedItem, setSelectedItem } = useNavigation();
    const { data:user, error:userError, isLoading:userLoading } = useUser();

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

            <div className={cn("w-max h-screen flex flex-col justify-between bg-black-light border-r border-edge py-4")} {...props}>
                <div className={"space-y-2"}>
                    <div className={"flex flex-row space-x-4 items-center mb-7 border-b border-edge px-4 pb-3"}>
                        <Flower size={30}/>
                        <span className={"text-3xl"}>fluer</span>
                    </div>

                    <div className={"space-y-1 pt-4 px-4"}>
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

                    <div className={"py-12 px-4 space-y-1"}>
                        <div className={"flex flex-row space-x-2 items-center text-marcador hover:text-white cursor-pointer"}
                             onClick={() => setOpenTeamMenu(!openTeamMenu)}
                        >
                            <span className={cn("text-xs pl-1")}>{"TEAMS"}</span>
                            { openTeamMenu ? <ChevronDown size={14}/> : <ChevronRight size={14}/> }
                        </div>

                        {openTeamMenu && user.teams.map((team) => (
                            <NavigationItem key={team.id}
                                            selected={selectedItem === team.name}
                                            title={team.name}
                                            icon={<Users size={18}/>}
                            />
                        ))}
                        {openTeamMenu &&
                            <NavigationItem selected={false}
                                            title={"Join a team"}
                                            icon={<SquarePlus size={18}/>}
                                            onClick={() => joinTeamDialogRef.current?.show()}
                            />
                        }
                    </div>
                </div>
                <ProfileContextMenu/>
            </div>
        </>
    );
});
Drawer.displayName = "Drawer";