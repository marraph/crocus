"use client";

import {Breadcrump} from "@marraph/daisy/components/breadcrump/Breadcrump";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {useRouter} from "next/navigation";
import {DeleteTaskDialog} from "@/components/dialogs/DeleteTaskDialog";
import {CloseTaskDialog} from "@/components/dialogs/CloseTaskDialog";
import {MessageTaskDialog} from "@/components/dialogs/MessageTaskDialog";
import {EditTaskDialog} from "@/components/dialogs/EditTaskDialog";
import {cn} from "@/utils/cn";
import {Trash2} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import React from "react";

const task = {
    title: "Title",
    description: "wigbw iwi iwbig iw i niwnoq nlsndkln dsnksg sd.",
    team: "Team",
    project: "Project",
    priority: "Priority",
    topic: "Topic",
    status: "Status",
    dueDate: "DueDate",
    change: "Change",
    changedAt: "ChangedAt",
    changedFrom: "ChangedFrom",
    createdAt: "CreatedAt",
    creator: "Creator",
}

export default function TaskIdPage() {
    const router = useRouter();

    return (
        <div className={"h-full flex flex-col space-y-4"}>
            <div className={"w-full flex flex-row justify-between"}>
                <Breadcrump pastText={"Tasks"} nowText={"Api not working"} className={"h-8"}
                            onClick={() => router.push("/tasks/")}/>
                <div className={"flex flex-row justify-end"}>
                    <MessageTaskDialog/>
                    <EditTaskDialog/>
                    <CloseTaskDialog/>
                    <DeleteTaskDialog buttonTrigger={true}/>
                </div>
            </div>
            <div className={"flex flex-row grow border border-white border-opacity-20 bg-black rounded-lg"}>
                <div className={"w-full min-h-full bg-dark rounded-l-lg space-y-4 "}>

                </div>
                <div className={"w-max min-h-full bg-black rounded-lg h-min flex flex-col text-sm"}>
                    <div className={"flex flex-row space-x-4 px-4 pt-4 pb-2"}>
                        <div className={"w-16 text-gray"}>Title</div>
                        <span>{task.title}</span>
                    </div>
                    <Seperator className={"w-full py-4"}/>
                    <div className={"flex flex-row space-x-4 px-4 py-2 h-32"}>
                        <div className={"w-16 text-gray"}>Description</div>
                        <span className={"flex-1 break-words"}>{task.description}</span>
                    </div>
                    <Seperator className={"w-full"}/>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-16 text-gray"}>Team</div>
                        <span>{task.team}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-16 text-gray"}>Project</div>
                        <span>{task.project}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-16 text-gray"}>Priority</div>
                        <span>{task.priority}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-16 text-gray"}>Topic</div>
                        <span>{task.topic}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-16 text-gray"}>Status</div>
                        <span>{task.status}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-16 text-gray"}>Due Date</div>
                        <span>{task.dueDate}</span>
                    </div>
                    <Seperator className={"w-full py-4"}/>
                    <span className={"text-xs text-placeholder px-4 py-2"}>LAST CHANGE</span>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-24 text-gray"}>Change</div>
                        <span>{task.change}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-24 text-gray"}>Time Changed</div>
                        <span>{task.changedAt}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-24 text-gray"}>Changer</div>
                        <span>{task.changedFrom}</span>
                    </div>
                    <Seperator className={"w-full py-4"}/>
                    <span className={"text-xs text-placeholder px-4 py-2"}>CREATION</span>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-24 text-gray"}>Time Created</div>
                        <span>{task.createdAt}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 pt-2 pb-4"}>
                        <div className={"w-24 text-gray"}>Creator</div>
                        <span>{task.creator}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}