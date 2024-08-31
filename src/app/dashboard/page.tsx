"use client";

import React, {useCallback, useMemo} from "react";
import {ExternalLink, Moon, SunMedium} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {StatusBadge} from "@/components/badges/StatusBadge";
import {ProfileBadge} from "@/components/badges/ProfileBadge";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Button} from "@marraph/daisy/components/button/Button";
import {useRouter} from "next/navigation";
import {ProjectBadge} from "@/components/badges/ProjectBadge";
import moment from "moment";
import {Headbar} from "@/components/Headbar";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";
import {getDashboardTasks, getProjectByTaskId} from "@/utils/object-helpers";

export default function Dashboard() {
    const router = useRouter();
    const { user, loading, error } = useUser();
    const {addTooltip, removeTooltip} = useTooltip();

    const dashboardTasks = useMemo(() => user && getDashboardTasks(user), [user]);

    const greeting = useMemo(() => {
            const hour = new Date().getHours();
            if (hour > 5 && hour < 11) return "Good morning";
            if (hour >= 11 && hour < 14) return "Good noon";
            if (hour >= 14 && hour < 18) return "Good afternoon";
            if (hour >= 18 && hour < 22) return "Good evening";
            return "Good night";
        }, []);

    const timeStats = useMemo(() => [
        { name: "40 Hours", description: "worked this week" },
        { name: "30%", description: "spend on meetings" },
        { name: "50%", description: "spend on Project A" },
        { name: "20%", description: "spend on fixing bugs" },
    ], []);

    const parseDate = useCallback((date: Date): string => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }, []);
    
    if (!user) return null;

    return (
        <div className={"h-screen w-screen flex flex-col"}>
            <Headbar title={"Dashboard"}/>

            <div className={"flex-grow flex flex-col p-4 overflow-hidden"}>
                <div className={"flex flex-row justify-between items-center"}>
                    <div className={"pt-4"}>
                        <span className={"text-xl"}>{greeting + user.name.split(' ')[0]}</span>
                        <div className={"flex flex-row items-center space-x-2"}>
                            {new Date().getHours() < 18 && <SunMedium size={18} color={"#bfb439"}/>}
                            {new Date().getHours() >= 18 && <Moon size={18} color={"#c9c9c9"}/>}
                            <span className={"text-gray"}>{parseDate(new Date())}</span>
                        </div>
                    </div>
                </div>
                <div className={"flex flex-row items-center space-x-16 w-full h-1/2 pt-8 pb-8"}>
                    <div className={"grid grid-cols-2 gap-4 bg-zinc-200 dark:bg-dark rounded-lg border border-zinc-300 dark:border-edge p-4 w-1/2 h-72"}>
                        {timeStats.map((item, index) => (
                            <div key={index} className={"flex flex-col items-center justify-center space-y-2 bg-zinc-100 dark:bg-black-light rounded-lg"}>
                                <span className={"text-xl"}>{item.name}</span>
                                <span className={"text-zinc-500 dark:text-gray"}>{item.description}</span>
                            </div>
                        ))}
                    </div>

                    <div className={"bg-zinc-200 dark:bg-dark rounded-lg border border-zinc-300 dark:border-edge w-1/2 h-72"}>

                    </div>
                </div>

                <div className={"flex-grow flex flex-col bg-zinc-100 dark:bg-black-light rounded-lg w-full border-x border-b border-zinc-300 dark:border-edge overflow-hidden"}>
                    <div className={"flex flex-row justify-between items-center bg-zinc-200 dark:bg-dark-light border-y border-zinc-300 dark:border-edge rounded-t-lg"}>
                        <div className={"flex flex-row items-center"}>
                            <span className={"text-md px-4 py-1"}>{"Tasks"}</span>
                            <Badge text={dashboardTasks?.length.toString() + " OPEN"}
                                   size={"small"}
                                   className={"rounded-md bg-zinc-700 dark:bg-white-dark text-zinc-200 dark:text-dark py-0.5 px-1.5"}>
                            </Badge>
                        </div>
                        <Button text={"Open"}
                                className={"m-1 font-normal bg-zinc-200 dark:bg-dark-light hover:bg-zinc-200 dark:hover:bg-dark border-none"}
                                onClick={() => router.push("/tasks")}
                                icon={<ExternalLink size={16}/>}
                                onMouseEnter={(e) => {
                                    addTooltip({
                                        message: "Open full view",
                                        anchor: "tr",
                                        trigger: e.currentTarget.getBoundingClientRect()
                                    });
                                }}
                                onMouseLeave={() => removeTooltip()}
                        />
                    </div>
                    <div className={"flex-grow overflow-auto no-scrollbar rounded-b-lg"}>
                        {loading &&
                            <div></div>
                        }
                        {error &&
                            <div></div>
                        }

                        {!loading && !error && dashboardTasks?.map((task, index) => (
                            <div key={index}
                                 className={"group flex flex-row justify-between items-center p-2 border-b border-zinc-300 dark:border-edge " +
                                     "hover:bg-zinc-200 dark:hover:bg-dark hover:cursor-pointer"}
                                 onClick={() => router.push(`/tasks/${task?.id}`)}>
                                <div className={"flex flex-row space-x-8 items-center pl-4"}>
                                    {getProjectByTaskId(user, task.id) &&
                                        <ProjectBadge
                                            title={getProjectByTaskId(user, task.id).name ?? ""}
                                            onMouseEnter={(e) => {
                                                addTooltip({
                                                    message: "Project: " + getProjectByTaskId(user, task.id).name,
                                                    anchor: "tl",
                                                    trigger: e.currentTarget.getBoundingClientRect()
                                                });
                                            }}
                                            onMouseLeave={() => removeTooltip()}
                                        />
                                    }
                                    <span className={"text-zinc-500 dark:text-gray text-sm group-hover:text-zinc-800 dark:group-hover:text-white"}>{task.name}</span>
                                </div>
                                <div className={"flex flex-row space-x-8 items-center pr-4"}>
                                    {task.state && <StatusBadge title={task.state?.toString()}/>}
                                    {task.deadline &&
                                        <span className={"text-xs text-zinc-500 dark:text-gray group-hover:text-zinc-800 dark:group-hover:text-white"}
                                            onMouseEnter={(e) => {
                                                addTooltip({
                                                    message: "Deadline: " + moment(task.deadline?.toString()).format('MMM D YYYY'),
                                                    anchor: "tl",
                                                    trigger: e.currentTarget.getBoundingClientRect()
                                                });
                                            }}
                                            onMouseLeave={() => removeTooltip()}
                                        >
                                            {moment(task.deadline?.toString()).format('MMM D YYYY')}
                                        </span>
                                    }
                                    <ProfileBadge name={task.createdBy.toString()}/>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}