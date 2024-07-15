"use client";

import React from "react";
import {ExternalLink, Moon, SunMedium} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {getDashboardTasks} from "@/utils/getTypes";
import {StatusBadge} from "@/components/badges/StatusBadge";
import {ProfileBadge} from "@/components/badges/ProfileBadge";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Button} from "@marraph/daisy/components/button/Button";
import {useRouter} from "next/navigation";
import {formatDate} from "@/utils/format";
import {NotificationContextMenu} from "@/components/contextmenus/NotificationContextMenu";
import {ProjectBadge} from "@/components/badges/ProjectBadge";
import {CustomScroll} from "react-custom-scroll";

const notifications = [
    { sender: "John Doe", task: "Task 1", date: new Date("2024-06-29T08:00:00"), type: "message" },
    { sender: "Jane Doe", task: "Task 2", date: new Date("2024-06-28T14:30:00"), type: "change" },
    { sender: "John Doe", task: "Task 3", date: new Date("2024-06-27T09:45:00"), type: "message" },
    { sender: "Jane Doe", task: "Task 4", date: new Date("2024-06-26T11:15:00"), type: "change" },
    { sender: "John Doe", task: "Task 5", date: new Date("2024-06-25T16:50:00"), type: "message" },
    { sender: "Jane Doe", task: "Task 6", date: new Date("2024-06-24T13:20:00"), type: "change" },
    { sender: "John Doe", task: "Task 7", date: new Date("2024-06-23T10:05:00"), type: "message" },
    { sender: "Jane Doe", task: "Task 8", date: new Date("2024-06-22T15:40:00"), type: "change" },
    { sender: "John Doe", task: "Task 9", date: new Date("2024-06-21T08:25:00"), type: "message" },
    { sender: "Jane Doe", task: "Task 10", date: new Date("2024-06-20T14:10:00"), type: "change" },
];

export default function Dashboard() {
    const router = useRouter();
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    if (!user) return null;

    const { tasks, count } = getDashboardTasks(user);

    function parseDate(date: Date): string {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function getDayText(): string {
        let date = new Date();
        if (date.getHours() > 5 && date.getHours() < 11)  return "Good morning, ";
        if (date.getHours() > 11 && date.getHours() < 14)  return "Good noon, ";
        if (date.getHours() > 14 && date.getHours() < 18) return "Good afternoon, ";
        if (date.getHours() > 18 && date.getHours() < 22) return "Good evening, ";
        if (date.getHours() > 22 && date.getHours() < 5) return "Good night, ";
        else return "Welcome back, "
    }

    return (
        <div className={"h-full flex flex-col justify-between p-8 "}>
            <div className={"flex flex-row justify-between items-center"}>
                <div className={"pt-4"}>
                    <span className={"text-xl"}>{getDayText() + user?.name.split(' ')[0]}</span>
                    <div className={"flex flex-row items-center space-x-2"}>
                        {new Date().getHours() < 18 && <SunMedium size={18} color={"#fff04d"}/>}
                        {new Date().getHours() >= 18 && <Moon size={18} color={"#c9c9c9"}/>}
                        <span className={"text-gray"}>{parseDate(new Date())}</span>
                    </div>
                </div>
                <NotificationContextMenu notifications={notifications}/>
            </div>
            <div className={"flex flex-row items-center space-x-16 w-full h-1/2 pt-8 pb-16"}>
                <div className={"flex flex-col justify-evenly bg-black rounded-lg border border-edge p-4 space-y-4 w-1/2 h-72"}>
                    <div className={"flex flex-row space-x-4 w-full h-full"}>
                        <div className={"flex flex-col items-center justify-center bg-dark rounded-lg w-1/2 h-full"}>
                            <span className={"text-xl"}>{"40 Hours"}</span>
                            <span className={"text-gray"}>{"worked this week"}</span>
                        </div>
                        <div className={"flex flex-col items-center justify-center bg-dark rounded-lg w-1/2 h-full"}>
                            <span className={"text-xl"}>{"30%"}</span>
                            <span className={"text-gray"}>{"spend on meetings"}</span>
                        </div>
                    </div>
                    <div className={"flex flex-row space-x-4 w-full h-full"}>
                        <div className={"flex flex-col items-center justify-center bg-dark rounded-lg w-1/2 h-full"}>
                            <span className={"text-xl"}>{"50%"}</span>
                            <span className={"text-gray"}>{"spend on Project A"}</span>
                        </div>
                        <div className={"flex flex-col items-center justify-center bg-dark rounded-lg w-1/2 h-full"}>
                            <span className={"text-xl"}>{"20%"}</span>
                            <span className={"text-gray"}>{"spend on fixing bugs"}</span>
                        </div>
                    </div>

                </div>
                <div className={"bg-black rounded-lg border border-edge w-1/2 h-72"}>

                </div>
            </div>

            <div className={"bg-black rounded-lg w-full"}>
                <div className={"flex flex-row justify-between items-center bg-dark-light border-t border-x border-edge rounded-t-lg"}>
                    <div className={"flex flex-row items-center"}>
                        <span className={"text-xl px-4 py-2"}>{"Tasks"}</span>
                        <Badge text={count.toString() + " OPEN"}
                               size={"small"}
                               className={"rounded-md bg-white-dark text-dark"}>
                        </Badge>
                    </div>
                    <Button text={"Open"}
                            className={"m-2 bg-dark-light border-none"}
                            onClick={() => router.push("/tasks")}
                            icon={<ExternalLink size={16} className={"mr-2"}/>}
                    />
                </div>
                <CustomScroll>
                    <div className={"h-[350px] border border-edge rounded-b-lg"}>
                        {tasks.map((task, index) => (
                            <div key={index}
                                 className={"group flex flex-row justify-between items-center p-2 border-b border-edge " +
                                     "hover:bg-dark hover:cursor-pointer"}
                                 onClick={() => router.push(`/tasks/${task.id}`)}>
                                <div className={"flex flex-row space-x-8 items-center pl-4"}>
                                    <ProjectBadge title={task.project?.name ?? ""}/>
                                    <span className={"text-gray group-hover:text-white"}>{task.name}</span>
                                </div>
                                <div className={"flex flex-row space-x-8 items-center pr-4"}>
                                    <StatusBadge title={task.status?.toString()}/>
                                    <span
                                        className={"text-sm text-gray group-hover:text-white"}>{formatDate(task.deadline?.toString())}</span>
                                    <ProfileBadge name={task.createdBy?.name}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </CustomScroll>

            </div>
        </div>
    );
}