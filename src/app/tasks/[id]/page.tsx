"use client";

import {Breadcrump} from "@marraph/daisy/components/breadcrump/Breadcrump";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {useParams, usePathname, useRouter} from "next/navigation";
import {DeleteTaskDialog} from "@/components/dialogs/DeleteTaskDialog";
import {CloseTaskDialog} from "@/components/dialogs/CloseTaskDialog";
import {MessageTaskDialog} from "@/components/dialogs/MessageTaskDialog";
import {EditTaskDialog} from "@/components/dialogs/EditTaskDialog";
import React from "react";
import {getTask} from "@/service/hooks/taskHook";
import {formatDate} from "@/utils/format";

export default function TasksID() {
    const router = useRouter();
    const pathname = usePathname();
    const id = Number(pathname.split('/').pop());
    const {data:Task, isLoading:taskLoading, error:taskError} = getTask(id);

    return (
        <div className={"h-full flex flex-col space-y-4"}>
            <div className={"w-full flex flex-row justify-between"}>
                <Breadcrump pastText={"Tasks"} nowText={"Api not working"} className={"h-8"}
                            onClick={() => router.push("/tasks/")}/>
                <div className={"flex flex-row justify-end"}>
                    <MessageTaskDialog/>
                    <EditTaskDialog buttonTrigger={true}/>
                    <CloseTaskDialog buttonTrigger={true}/>
                    <DeleteTaskDialog buttonTrigger={true}/>
                </div>
            </div>
            <div className={"flex flex-row grow border border-white border-opacity-20 bg-black rounded-lg"}>
                <div className={"w-full min-h-full bg-dark rounded-l-lg space-y-4 "}>

                </div>
                <div className={"w-max min-h-full bg-black rounded-lg h-min flex flex-col text-sm"}>
                    <div className={"flex flex-row space-x-4 px-4 pt-4 pb-2"}>
                        <div className={"w-16 text-gray"}>Title</div>
                        <span>{Task?.name}</span>
                    </div>
                    <Seperator className={"w-full py-4"}/>
                    <div className={"flex flex-row space-x-4 px-4 py-2 h-32"}>
                        <div className={"w-16 text-gray"}>Description</div>
                        <span className={"flex-1 break-words"}>{Task?.description}</span>
                    </div>
                    <Seperator className={"w-full"}/>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-16 text-gray"}>Team</div>
                        <span>{"team fetch"}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-16 text-gray"}>Project</div>
                        <span>{"project fetch"}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-16 text-gray"}>Priority</div>
                        <span>{Task?.priority}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-16 text-gray"}>Topic</div>
                        <span>{Task?.topic.title}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-16 text-gray"}>Status</div>
                        <span>{Task?.status}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-16 text-gray"}>Due Date</div>
                        <span>{formatDate(Task?.deadline.toString())}</span>
                    </div>
                    <Seperator className={"w-full py-4"}/>
                    <span className={"text-xs text-placeholder px-4 py-2"}>LAST CHANGE</span>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-24 text-gray"}>Change</div>
                        <span>{"change fehlt"}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-24 text-gray"}>Time Changed</div>
                        <span>{formatDate(Task?.lastModifiedDate.toString())}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-24 text-gray"}>Changer</div>
                        <span>{Task?.lastModifiedBy.name}</span>
                    </div>
                    <Seperator className={"w-full py-4"}/>
                    <span className={"text-xs text-placeholder px-4 py-2"}>CREATION</span>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <div className={"w-24 text-gray"}>Time Created</div>
                        <span>{formatDate(Task?.createdDate.toString())}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 pt-2 pb-4"}>
                        <div className={"w-24 text-gray"}>Creator</div>
                        <span>{Task?.createdBy.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}