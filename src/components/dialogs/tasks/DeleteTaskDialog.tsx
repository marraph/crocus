"use client";

import {Dialog, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
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
    buttonTrigger: boolean;
    taskElement: TaskElement;
}

export const DeleteTaskDialog = forwardRef<DialogRef, DialogProps>(({ taskElement, buttonTrigger, className, ...props}, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    if (!dialogRef) return null;
    if (!user) return null;

    const deleteTheTask = () => {
        const {isLoading, error} = deleteTask(taskElement.id);
        dialogRef.current?.close();
        alertRef.current?.show();
    }

    return (
        <>
            {buttonTrigger &&
                <Button text={""} className={cn("w-min h-8 text-lightred hover:text-lightred hover:bg-lightred hover:bg-opacity-10")}
                    onClick={() => dialogRef.current?.show()}>
                    <Trash2 size={20}/>
                </Button>
            }

            <div className={cn("flex items-center justify-center")}>
                <Dialog className={cn("border border-white border-opacity-20 w-3/8 drop-shadow-lg overflow-visible p-4 space-y-4")}{...props} ref={dialogRef}>
                    <div className={cn("flex flex-col space-y-4")}>
                        <p className={cn("text-white")}>Are you sure you want to delete this task?</p>
                        <div className={cn("flex flex-row space-x-2 justify-end")}>
                            <Button text={"Cancel"} className={cn("h-8")} onClick={() => dialogRef.current?.close()}/>
                            <Button text={"Delete"} onClick={deleteTheTask} className={cn("h-8 text-lightred hover:bg-lightred hover:bg-opacity-10 hover:text-lightred")}/>
                        </div>
                    </div>
                </Dialog>
            </div>

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