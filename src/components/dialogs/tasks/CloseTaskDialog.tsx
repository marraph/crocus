"use client";

import React, {forwardRef, MutableRefObject, useEffect, useRef, useState} from "react";
import {CheckCheck} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {cn} from "@/utils/cn";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
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
    taskElement: TaskElement;
}

export const CloseTaskDialog = forwardRef<DialogRef, DialogProps>(({ taskElement }, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const [dialogKey, setDialogKey] = useState(Date.now());
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
        alertRef.current?.show();
    }

    const handleClose = () => {
        setDialogKey(Date.now());
    }

    return (
        <>
            <Dialog width={600} ref={dialogRef} key={dialogKey}>
                <DialogHeader title={"Close Task"}
                              dialogRef={dialogRef}
                              onClose={handleClose}
                />
                <DialogContent>
                    <span className={"text-gray pb-4"}>
                        Are you sure you want to close this task?
                    </span>
                </DialogContent>
                <DialogFooter saveButtonTitle={"Close"}
                              cancelButton={true}
                              switchButton={false}
                              dialogRef={dialogRef}
                              onClick={closeTask}
                              onClose={handleClose}
                />
            </Dialog>

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