"use client";

import {Breadcrumb} from "@marraph/daisy/components/breadcrumb/Breadcrumb";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {useParams, useRouter} from "next/navigation";
import {DeleteTaskDialog} from "@/components/dialogs/tasks/DeleteTaskDialog";
import {CloseTaskDialog} from "@/components/dialogs/tasks/CloseTaskDialog";
import {EditTaskDialog} from "@/components/dialogs/tasks/EditTaskDialog";
import React, {useEffect, useRef, useState} from "react";
import {
    Box,
    CalendarDays,
    CheckCheck,
    CircleAlert,
    Hourglass,
    LineChart,
    Pencil,
    Tag,
    Trash2,
    Users
} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {cn} from "@/utils/cn";
import {MessageBar} from "@/components/MessageBar";
import moment from "moment";
import {Headbar} from "@/components/Headbar";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";
import {useHotkeys} from "react-hotkeys-hook";
import {ComplexTask, getTaskFromId} from "@/utils/object-helpers";
import {useUser} from "@/context/UserContext";

export default function Page() {
    const closeRef = useRef<DialogRef>(null);
    const deleteRef = useRef<DialogRef>(null);
    const editRef = useRef<DialogRef>(null);
    const [enabled, setEnabled] = useState(true);
    const [task, setTask] = useState<ComplexTask | null>(null);
    const router = useRouter();
    const id = Number(useParams().id);
    const {user, loading, error} = useUser();
    const { addTooltip, removeTooltip } = useTooltip();

    useHotkeys('e', () => {
        editRef.current?.show();
        setEnabled(false);
    }, { enabled }, [enabled]);
    useHotkeys('c', () => {
        closeRef.current?.show();
        setEnabled(false);
    }, { enabled });
    useHotkeys('d', () => {
        deleteRef.current?.show();
        setEnabled(false);
    }, { enabled });

    useEffect(() => {
        if (task?.task && user) {
            const task = getTaskFromId(user, id);
            setTask(task);
        }
    }, [id, task?.task, user]);


    if (!task?.task) {
        return <div>Not found</div>
    }

    if (loading) {
        return <div>Loading Task...</div>;
    }

    return (
        <>
            <DeleteTaskDialog ref={deleteRef} task={task.task} onClose={() => setEnabled(true)}/>
            <CloseTaskDialog ref={closeRef} task={task.task} onClose={() => setEnabled(true)}/>
            <EditTaskDialog ref={editRef} task={task} onClose={() => setEnabled(true)}/>

            <div className={"h-screen w-screen flex flex-col overflow-hidden"}>
                <Headbar>
                    <Breadcrumb pastText={"Tasks"}
                                nowText={task.task?.name}
                                onClick={() => router.push("/tasks/")}
                    />
                </Headbar>

                <div className={"h-full flex flex-col space-y-4 p-4"}>
                    <div className={"w-full flex flex-row justify-between"}>

                        <div className={"flex flex-row justify-end"}>
                            <div className={"flex flex-row space-x-2"}>
                                <Button text={"Edit"}
                                        onClick={() => editRef.current?.show()}
                                        icon={<Pencil size={16} className={"mr-2"} />}
                                        onMouseEnter={(e) => {
                                            addTooltip({
                                                message: "Edit Task",
                                                shortcut: "E",
                                                anchor: "tl",
                                                trigger: e.currentTarget.getBoundingClientRect()
                                            });
                                        }}
                                        onMouseLeave={() => removeTooltip()}
                                />
                                <Button text={"Close"}
                                        onClick={() => closeRef.current?.show()}
                                        icon={<CheckCheck size={20} className={"mr-2"}/>}
                                        onMouseEnter={(e) => {
                                            addTooltip({
                                                message: "Close Task",
                                                shortcut: "C",
                                                anchor: "tl",
                                                trigger: e.currentTarget.getBoundingClientRect()
                                            });
                                        }}
                                        onMouseLeave={() => removeTooltip()}
                                />
                                <Button text={""}
                                        onClick={() => deleteRef.current?.show()}
                                        className={cn("w-min red-button-style hover:red-button-style")}
                                        icon={<Trash2 size={20}/>}
                                        onMouseEnter={(e) => {
                                            addTooltip({
                                                message: "Delete Task",
                                                shortcut: "D",
                                                anchor: "tl",
                                                trigger: e.currentTarget.getBoundingClientRect()
                                            });
                                        }}
                                        onMouseLeave={() => removeTooltip()}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={"h-full w-full flex flex-row border border-zinc-300 dark:border-edge rounded-lg"}>

                        <div className={"flex flex-col justify-between w-3/4 h-full bg-zinc-200 dark:bg-dark rounded-l-lg"}>
                            <div className={"h-full"}>

                            </div>
                            <MessageBar className={""}/>
                        </div>


                        <div className={"border-l border-zinc-300 dark:border-edge w-1/4 min-h-full bg-zinc-100 dark:bg-black-light rounded-lg rounded-l-none h-min flex flex-col text-sm"}>
                            <div className={"flex flex-row space-x-4 px-4 pt-4 pb-2"}>
                                <div className={"w-16 text-zinc-500 dark:text-gray"}>Title</div>
                                <span>{task.task?.name}</span>
                            </div>
                            <Seperator className={"w-full py-4"}/>
                            <div className={"flex flex-row space-x-4 px-4 py-2 h-20"}>
                                <div className={"w-16 text-zinc-500 dark:text-gray"}>Description</div>
                                <span className={"flex-1 break-words"}>{task.task?.description}</span>
                            </div>
                            <Seperator className={"w-full"}/>
                            <div className={"flex flex-row space-x-4 px-4 py-2"}>
                                <div className={"flex flex-row items-center space-x-2 text-zinc-500 dark:text-gray"}>
                                    <Users size={16}/>
                                    <span className={"w-16"}>Team</span>
                                </div>
                                <span>{task.team?.name}</span>
                            </div>
                            <div className={"flex flex-row space-x-4 px-4 py-2"}>
                                <div className={"flex flex-row items-center space-x-2 text-zinc-500 dark:text-gray"}>
                                    <Box size={16}/>
                                    <span className={"w-16"}>Project</span>
                                </div>
                                <span>{task.project?.name}</span>
                            </div>
                            <div className={"flex flex-row space-x-4 px-4 py-2"}>
                                <div className={"flex flex-row items-center space-x-2 text-zinc-500 dark:text-gray"}>
                                    <LineChart size={16}/>
                                    <span className={"w-16"}>Priority</span>
                                </div>
                                <span>{task.task?.priority}</span>
                            </div>
                            <div className={"flex flex-row space-x-4 px-4 py-2"}>
                                <div className={"flex flex-row items-center space-x-2 text-zinc-500 dark:text-gray"}>
                                    <Tag size={16}/>
                                    <span className={"w-16"}>Topic</span>
                                </div>
                                <span>{task.task.topic?.name}</span>
                            </div>
                            <div className={"flex flex-row space-x-4 px-4 py-2"}>
                                <div className={"flex flex-row items-center space-x-2 text-zinc-500 dark:text-gray"}>
                                    <CircleAlert size={16}/>
                                    <span className={"w-16"}>Status</span>
                                </div>
                                <span>{task.task?.state}</span>
                            </div>
                            <div className={"flex flex-row space-x-4 px-4 py-2"}>
                                <div className={"flex flex-row items-center space-x-2 text-zinc-500 dark:text-gray"}>
                                    <CalendarDays size={16}/>
                                    <span className={"w-16"}>Deadline</span>
                                </div>
                                <span>{moment(task.task?.deadline?.toString()).format('MMM D YYYY')}</span>
                            </div>
                            <div className={"flex flex-row space-x-4 px-4 py-2"}>
                                <div className={"flex flex-row items-center space-x-2 text-zinc-500 dark:text-gray"}>
                                    <Hourglass size={16}/>
                                    <span className={"w-16"}>Duration</span>
                                </div>
                                <span>{
                                    !task.task?.bookedDuration ? 0 : task.task.bookedDuration?.toString()
                                    + " / " + task.task.duration?.toString() + " hours"}
                                </span>
                            </div>
                            <Seperator className={"w-full py-4"}/>
                            <span className={"text-xs text-zinc-400 dark:text-marcador px-4 py-2"}>LAST CHANGE</span>
                            <div className={"flex flex-row space-x-4 px-4 py-2"}>
                                <div className={"w-24 text-zinc-500 dark:text-gray"}>Change</div>
                                <span>{"//CHANGE FEHLT"}</span>
                            </div>
                            <div className={"flex flex-row space-x-4 px-4 py-2"}>
                                <div className={"w-24 text-zinc-500 dark:text-gray"}>Time Changed</div>
                                <span>{moment(task.task?.updatedAt?.toString()).format('MMM D YYYY')}</span>
                            </div>
                            <div className={"flex flex-row space-x-4 px-4 py-2"}>
                                <div className={"w-24 text-zinc-500 dark:text-gray"}>Changed By</div>
                                <span>{task.task?.updatedBy.name}</span>
                            </div>
                            <Seperator className={"w-full py-4"}/>
                            <span className={"text-xs text-zinc-400 dark:text-marcador px-4 py-2"}>CREATION</span>
                            <div className={"flex flex-row space-x-4 px-4 py-2"}>
                                <div className={"w-24 text-zinc-500 dark:text-gray"}>Time Created</div>
                                <span>{moment(task.task?.createdAt?.toString()).format('MMM D YYYY')}</span>
                            </div>
                            <div className={"flex flex-row space-x-4 px-4 pt-2 pb-4"}>
                                <div className={"w-24 text-zinc-500 dark:text-gray"}>Created By</div>
                                <span>{task.task?.createdBy.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}