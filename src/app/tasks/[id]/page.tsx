"use client";

import {Breadcrump} from "@marraph/daisy/components/breadcrump/Breadcrump";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {useParams, useRouter} from "next/navigation";
import {DeleteTaskDialog} from "@/components/dialogs/tasks/DeleteTaskDialog";
import {CloseTaskDialog} from "@/components/dialogs/tasks/CloseTaskDialog";
import {MessageTaskDialog} from "@/components/dialogs/tasks/MessageTaskDialog";
import {EditTaskDialog} from "@/components/dialogs/tasks/EditTaskDialog";
import React, {useRef} from "react";
import {formatDate} from "@/utils/format";
import {useUser} from "@/context/UserContext";
import {findTaskProps} from "@/utils/findTaskProps";
import {
    Box,
    CalendarDays,
    CheckCheck,
    CircleAlert,
    Hourglass,
    LineChart,
    MessageSquare,
    Pencil,
    Tag,
    Trash2,
    Users
} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {cn} from "@/utils/cn";

export default function TasksID() {
    const closeRef = useRef<DialogRef>(null);
    const deleteRef = useRef<DialogRef>(null);
    const editRef = useRef<DialogRef>(null);
    const messageRef = useRef<DialogRef>(null);
    const router = useRouter();
    const id = Number(useParams().id);
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const {taskElement} = findTaskProps(user, id);

    return (
        <>
            <div className={"h-full flex flex-col space-y-4 p-8"}>
                <div className={"w-full flex flex-row justify-between"}>
                    <Breadcrump pastText={"Tasks"}
                                nowText={taskElement.name}
                                onClick={() => router.push("/tasks/")}
                    />
                    <div className={"flex flex-row justify-end"}>
                        <div className={"flex flex-row space-x-2"}>
                            <Button text={"Message"}
                                    theme={"white"}
                                    onClick={() => messageRef.current?.show()}
                                    icon={<MessageSquare size={20} className={"mr-2"}/>}
                            />
                            <Button text={"Edit"}
                                    onClick={() => editRef.current?.show()}
                                    icon={<Pencil size={16} className={"mr-2"} />}
                            />
                            <Button text={"Close"}
                                    onClick={() => closeRef.current?.show()}
                                    icon={<CheckCheck size={20} className={"mr-2"}/>}
                            />
                            <Button text={""}
                                    onClick={() => deleteRef.current?.show()}
                                    className={cn("w-min red-button-style hover:red-button-style")}
                                    icon={<Trash2 size={20}/>}
                            />
                        </div>

                        <DeleteTaskDialog ref={deleteRef} taskElement={taskElement}/>
                        <CloseTaskDialog ref={closeRef} taskElement={taskElement}/>
                        <EditTaskDialog ref={editRef} taskElement={taskElement}/>
                        <MessageTaskDialog ref={messageRef} taskElement={taskElement}/>
                    </div>
                </div>

                <div className={"h-full flex flex-row border border-edge bg-black rounded-lg"}>
                    <div className={"w-full min-h-full bg-dark rounded-l-lg space-y-4 "}>

                    </div>
                    <div className={"border-l border-edge w-96 min-h-full bg-black rounded-lg rounded-l-none h-min flex flex-col text-sm"}>
                        <div className={"flex flex-row space-x-4 px-4 pt-4 pb-2"}>
                            <div className={"w-16 text-gray"}>Title</div>
                            <span>{taskElement.name}</span>
                        </div>
                        <Seperator className={"w-full py-4"}/>
                        <div className={"flex flex-row space-x-4 px-4 py-2 h-20"}>
                            <div className={"w-16 text-gray"}>Description</div>
                            <span className={"flex-1 break-words"}>{taskElement.description}</span>
                        </div>
                        <Seperator className={"w-full"}/>
                        <div className={"flex flex-row space-x-4 px-4 py-2"}>
                            <div className={"flex flex-row items-center space-x-2 text-gray"}>
                                <Users size={16}/>
                                <span className={"w-16"}>Team</span>
                            </div>
                            <span>{taskElement.team?.name}</span>
                        </div>
                        <div className={"flex flex-row space-x-4 px-4 py-2"}>
                            <div className={"flex flex-row items-center space-x-2 text-gray"}>
                                <Box size={16}/>
                                <span className={"w-16"}>Project</span>
                            </div>
                            <span>{taskElement.project?.name}</span>
                        </div>
                        <div className={"flex flex-row space-x-4 px-4 py-2"}>
                            <div className={"flex flex-row items-center space-x-2 text-gray"}>
                                <LineChart size={16}/>
                                <span className={"w-16"}>Priority</span>
                            </div>
                            <span>{taskElement.priority}</span>
                        </div>
                        <div className={"flex flex-row space-x-4 px-4 py-2"}>
                            <div className={"flex flex-row items-center space-x-2 text-gray"}>
                                <Tag size={16}/>
                                <span className={"w-16"}>Topic</span>
                            </div>
                            <span>{taskElement.topic?.title}</span>
                        </div>
                        <div className={"flex flex-row space-x-4 px-4 py-2"}>
                            <div className={"flex flex-row items-center space-x-2 text-gray"}>
                                <CircleAlert size={16}/>
                                <span className={"w-16"}>Status</span>
                            </div>
                            <span>{taskElement.status}</span>
                        </div>
                        <div className={"flex flex-row space-x-4 px-4 py-2"}>
                            <div className={"flex flex-row items-center space-x-2 text-gray"}>
                                <CalendarDays size={16}/>
                                <span className={"w-16"}>Deadline</span>
                            </div>
                            <span>{formatDate(taskElement.deadline?.toString())}</span>
                        </div>
                        <div className={"flex flex-row space-x-4 px-4 py-2"}>
                            <div className={"flex flex-row items-center space-x-2 text-gray"}>
                                <Hourglass size={16}/>
                                <span className={"w-16"}>Duration</span>
                            </div>
                            <span>{
                                !taskElement.bookedDuration ? 0 : taskElement.bookedDuration?.toString()
                                + " / " + taskElement.duration?.toString() + " hours"}
                            </span>
                        </div>
                        <Seperator className={"w-full py-4"}/>
                        <span className={"text-xs text-marcador px-4 py-2"}>LAST CHANGE</span>
                        <div className={"flex flex-row space-x-4 px-4 py-2"}>
                            <div className={"w-24 text-gray"}>Change</div>
                            <span>{"//CHANGE FEHLT"}</span>
                        </div>
                        <div className={"flex flex-row space-x-4 px-4 py-2"}>
                            <div className={"w-24 text-gray"}>Time Changed</div>
                            <span>{formatDate(taskElement.lastModifiedDate.toString())}</span>
                        </div>
                        <div className={"flex flex-row space-x-4 px-4 py-2"}>
                            <div className={"w-24 text-gray"}>Changed By</div>
                            <span>{taskElement.lastModifiedBy.name}</span>
                        </div>
                        <Seperator className={"w-full py-4"}/>
                        <span className={"text-xs text-marcador px-4 py-2"}>CREATION</span>
                        <div className={"flex flex-row space-x-4 px-4 py-2"}>
                            <div className={"w-24 text-gray"}>Time Created</div>
                            <span>{formatDate(taskElement.createdDate.toString())}</span>
                        </div>
                        <div className={"flex flex-row space-x-4 px-4 pt-2 pb-4"}>
                            <div className={"w-24 text-gray"}>Created By</div>
                            <span>{taskElement.createdBy.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}