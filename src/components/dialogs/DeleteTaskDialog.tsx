"use client";

import {Dialog} from "@marraph/daisy/components/dialog/Dialog";
import {Button} from "@marraph/daisy/components/button/Button";
import {Trash2} from "lucide-react";
import {cn} from "@/utils/cn";
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {Task, TaskElement} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {deleteTask, updateTask} from "@/service/hooks/taskHook";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    buttonTrigger: boolean;
    taskElement: TaskElement;
}

export const DeleteTaskDialog = React.forwardRef<HTMLDialogElement, DialogProps>(({ taskElement, buttonTrigger, className, ...props}, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [showAlert, setShowAlert] = useState(false);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    const getDialogRef = (): MutableRefObject<HTMLDialogElement | null> => {
        if (ref && typeof ref === 'object') {
            return ref as MutableRefObject<HTMLDialogElement | null>;
        }
        return dialogRef;
    };

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => setShowAlert(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    if (!user) return null;

    const deleteTheTask = () => {
        const {isLoading, error} = deleteTask(taskElement.id);
        getDialogRef().current?.close();
        setShowAlert(true);
    }

    return (
        <>
            {buttonTrigger &&
                <Button text={""} className={cn("w-min h-8 text-lightred " +
                    "hover:text-lightred hover:bg-lightred hover:bg-opacity-10")}
                    onClick={() => getDialogRef().current?.showModal()}>
                    <Trash2 size={20}/>
                </Button>
            }

            <div className={cn("flex items-center justify-center")}>
                <Dialog className={cn("border border-white border-opacity-20 w-3/8 drop-shadow-lg overflow-visible p-4 space-y-4")}{...props} ref={getDialogRef()}>
                    <div className={cn("flex flex-col space-y-4")}>
                        <p className={cn("text-white")}>Are you sure you want to delete this task?</p>
                        <div className={cn("flex flex-row space-x-2 justify-end")}>
                            <Button text={"Cancel"} className={cn("h-8")} onClick={() => getDialogRef().current?.close()}/>
                            <Button text={"Delete"} onClick={deleteTheTask} className={cn("h-8 text-lightred hover:bg-lightred hover:bg-opacity-10 hover:text-lightred")}/>
                        </div>
                    </div>
                </Dialog>
            </div>

            {showAlert && (
                <Alert duration={3000} className={"fixed bottom-4 right-4 z-50 border border-white border-opacity-20 bg-dark"}>
                    <AlertIcon icon={<Trash2 color="#F55050" />}/>
                    <AlertContent>
                        <AlertTitle title={"Task deleted successfully!"}></AlertTitle>
                        <AlertDescription description={"You can no longer interact with this task."}></AlertDescription>
                    </AlertContent>
                </Alert>
            )}
        </>
    )
})
DeleteTaskDialog.displayName = "DeleteTaskDialog";