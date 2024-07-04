"use client";

import React, {forwardRef, MutableRefObject, useEffect, useRef, useState} from "react";
import {CheckCheck} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {cn} from "@/utils/cn";
import {Dialog, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {
    Alert,
    AlertContent,
    AlertDescription,
    AlertIcon, AlertRef,
    AlertTitle
} from "@marraph/daisy/components/alert/Alert";
import {updateTask} from "@/service/hooks/taskHook";
import {PreviewUser, Priority, Status, Task, TaskElement, Topic} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {getDiffieHellman} from "node:crypto";
import {mutateRef} from "@/utils/mutateRef";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    buttonTrigger: boolean;
    taskElement: TaskElement;
}

export const CloseTaskDialog = forwardRef<DialogRef, DialogProps>(({ taskElement, buttonTrigger, className, ...props}, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    if (!dialogRef) return null;
    if (!user) return null;

    const closeTask = () => {
        const task: Task = {
            id: taskElement.id,
            name: taskElement.name,
            description: taskElement.description,
            topic: taskElement.topic,
            isArchived: true,
            duration: taskElement.duration,
            bookedDuration: taskElement.bookedDuration,
            deadline: taskElement.deadline,
            status: taskElement.status,
            priority: taskElement.priority,
            createdBy: taskElement.createdBy,
            createdDate: taskElement.createdDate,
            lastModifiedBy: {id: user.id, name: user.name, email: user.email },
            lastModifiedDate: new Date()
        }
        const {data, isLoading, error} = updateTask(task.id, task);
        dialogRef.current?.close();
        alertRef.current?.show();
    }

    return (
        <>
            {buttonTrigger &&
                <Button text={"Close"} className={"h-8 mr-2"} onClick={() => {
                    dialogRef.current?.show();
                }}>
                    <CheckCheck size={20} className={"mr-2"}/>
                </Button>
            }

            <div className={"flex items-center justify-center"}>
                <Dialog className={"border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible"} {...props} ref={dialogRef}>
                    <div className={"flex flex-row justify-between px-4"}>
                        <div className={"flex flex-col space-y-2"}>
                            <span className={"text-md text-white pt-4"}>Close Task</span>
                            <span className={"text-gray pb-4"}>If you close this task, you cant change properties of the task. Are you sure you want to close this task?</span>
                        </div>
                        <CloseButton className={"h-min w-min mt-4"} onClick={() => dialogRef.current?.close()}/>
                    </div>
                    <Seperator/>
                    <div className={cn("flex flex-row space-x-2 justify-end px-4 py-2")}>
                        <Button text={"Cancel"} className={cn("h-8")}
                                onClick={() => dialogRef.current?.close()}/>
                        <Button text={"Close Task"} onClick={closeTask}
                                className={"h-8 text-purple hover:bg-purple hover:bg-opacity-10 hover:text-purple"}/>
                    </div>
                </Dialog>
            </div>

            <Alert duration={3000} ref={alertRef} closeButton={false}>
                <AlertIcon icon={<CheckCheck />}/>
                <AlertContent>
                    <AlertTitle title={"Task closed successfully!"}></AlertTitle>
                    <AlertDescription description={"You can no longer interact with this task."}></AlertDescription>
                </AlertContent>
            </Alert>
        </>
    );
})
CloseTaskDialog.displayName = "CloseTaskDialog";