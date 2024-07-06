"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Button} from "@marraph/daisy/components/button/Button";
import {Trash2} from "lucide-react";
import {cn} from "@/utils/cn";
import React, {forwardRef, MutableRefObject, useEffect, useRef, useState} from "react";
import {
    Alert,
    AlertContent,
    AlertDescription,
    AlertIcon,
    AlertRef,
    AlertTitle
} from "@marraph/daisy/components/alert/Alert";
import {Task, TaskElement} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {deleteTask, updateTask} from "@/service/hooks/taskHook";
import {mutateRef} from "@/utils/mutateRef";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    taskElement: TaskElement;
}

export const DeleteTaskDialog = forwardRef<DialogRef, DialogProps>(({ taskElement }, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    if (!dialogRef) return null;
    if (!user) return null;

    const deleteTheTask = () => {
        const {isLoading, error} = deleteTask(taskElement.id);
        alertRef.current?.show();
    }

    return (
        <>
            <Dialog width={600} ref={dialogRef}>
                <DialogHeader title={"Delete Task"}
                              dialogRef={dialogRef}
                />
                <DialogContent>
                    <span className={"text-white"}>Are you sure you want to delete this task?</span>
                </DialogContent>
                <DialogFooter saveButtonTitle={"Delete"}
                              cancelButton={true}
                              switchButton={false}
                              dialogRef={dialogRef}
                              onClick={deleteTheTask}
                />
            </Dialog>

            <Alert duration={3000} ref={alertRef} closeButton={false}>
                <AlertIcon icon={<Trash2 color="#F55050" />}/>
                <AlertContent>
                    <AlertTitle title={"Task deleted successfully!"}></AlertTitle>
                    <AlertDescription description={"You can no longer interact with this task."}></AlertDescription>
                </AlertContent>
            </Alert>
        </>
    )
})
DeleteTaskDialog.displayName = "DeleteTaskDialog";