"use client";

import React, {useCallback, useMemo} from "react";
import {ExternalLink, Moon, SunMedium} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {getDashboardTasks} from "@/utils/getTypes";
import {StatusBadge} from "@/components/badges/StatusBadge";
import {ProfileBadge} from "@/components/badges/ProfileBadge";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Button} from "@marraph/daisy/components/button/Button";
import {useRouter} from "next/navigation";
import {ProjectBadge} from "@/components/badges/ProjectBadge";
import {CustomScroll} from "react-custom-scroll";
import moment from "moment";
import {Headbar} from "@/components/Headbar";

export default function Dashboard() {
    const router = useRouter();
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    const parseDate = useCallback((date: Date): string => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }, []);

    const getDayText = useCallback((): string => {
        let date = new Date();
        if (date.getHours() > 5 && date.getHours() < 11)  return "Good morning, ";
        if (date.getHours() > 11 && date.getHours() < 14)  return "Good noon, ";
        if (date.getHours() > 14 && date.getHours() < 18) return "Good afternoon, ";
        if (date.getHours() > 18 && date.getHours() < 22) return "Good evening, ";
        if (date.getHours() > 22 && date.getHours() < 5) return "Good night, ";
        else return "Welcome back, "
    }, []);

    const timeStats = useMemo(() => [
        { name: "40 Hours", description: "worked this week" },
        { name: "30%", description: "spend on meetings" },
        { name: "50%", description: "spend on Project A" },
        { name: "20%", description: "spend on fixing bugs" },
    ], []);

    if (!user) return null;
    const { tasks, count } = getDashboardTasks(user);

    return (
        <div className={"h-screen w-screen flex flex-col"}>
            <Headbar title={"Dashboard"}/>

            <div className={"flex-grow flex flex-col p-4 overflow-hidden"}>
                <div className={"flex flex-row justify-between items-center"}>
                    <div className={"pt-4"}>
                        <span className={"text-xl"}>{getDayText() + user?.name.split(' ')[0]}</span>
                        <div className={"flex flex-row items-center space-x-2"}>
                            {new Date().getHours() < 18 && <SunMedium size={18} color={"#fff04d"}/>}
                            {new Date().getHours() >= 18 && <Moon size={18} color={"#c9c9c9"}/>}
                            <span className={"text-gray"}>{parseDate(new Date())}</span>
                        </div>
                    </div>
                </div>
                <div className={"flex flex-row items-center space-x-16 w-full h-1/2 pt-8 pb-8"}>
                    <div className={"grid grid-cols-2 gap-4 bg-dark rounded-lg border border-edge p-4 w-1/2 h-72"}>
                        {timeStats.map((item, index) => (
                            <div key={index} className={"flex flex-col items-center justify-center space-y-2 bg-black-light rounded-lg"}>
                                <span className={"text-xl"}>{item.name}</span>
                                <span className={"text-gray"}>{item.description}</span>
                            </div>
                        ))}
                    </div>

                    <div className={"bg-dark rounded-lg border border-edge w-1/2 h-72"}>

                    </div>
                </div>

                <div className={"flex-grow flex flex-col bg-black-light rounded-lg w-full border-x border-b border-edge overflow-hidden"}>
                    <div className={"flex flex-row justify-between items-center bg-dark-light border-y border-edge rounded-t-lg"}>
                        <div className={"flex flex-row items-center"}>
                            <span className={"text-md px-4 py-1"}>{"Tasks"}</span>
                            <Badge text={count.toString() + " OPEN"}
                                   size={"small"}
                                   className={"rounded-md bg-white-dark text-dark p-0.5"}>
                            </Badge>
                        </div>
                        <Button text={"Open"}
                                className={"m-1 font-normal bg-dark-light hover:bg-dark border-none"}
                                onClick={() => router.push("/tasks")}
                                icon={<ExternalLink size={16} className={"mr-2"}/>}
                        />
                    </div>
                    <div className={"flex-grow overflow-auto no-scrollbar rounded-b-lg"}>
                        {tasks.map((task, index) => (
                            <div key={index}
                                 className={"group flex flex-row justify-between items-center p-2 border-b border-edge hover:bg-dark hover:cursor-pointer"}
                                 onClick={() => router.push(`/tasks/${task.id}`)}>
                                <div className={"flex flex-row space-x-8 items-center pl-4"}>
                                    <ProjectBadge title={task.project?.name ?? ""}/>
                                    <span className={"text-gray group-hover:text-white"}>{task.name}</span>
                                </div>
                                <div className={"flex flex-row space-x-8 items-center pr-4"}>
                                    <StatusBadge title={task.status?.toString()}/>
                                    <span
                                        className={"text-sm text-gray group-hover:text-white"}>{moment(task.deadline?.toString()).format('MMMM D YYY')}</span>
                                    <ProfileBadge name={task.createdBy?.name}/>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}