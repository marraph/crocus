"use client";

import {Dialog} from "@marraph/daisy/components/dialog/Dialog";
import {Button} from "@marraph/daisy/components/button/Button";
import {Trash2} from "lucide-react";
import {cn} from "@/utils/cn";
import React, {MutableRefObject, useRef, useState} from "react";
import {TaskDeletedAlert} from "@/components/alerts/TaskDeletedAlert";
import {getTask} from "@/service/hooks/taskHook";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    buttonTrigger: boolean;
}

export const DeleteTaskDialog = React.forwardRef<HTMLDialogElement, DialogProps>(({ buttonTrigger, className, ...props}, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [showAlert, setShowAlert] = useState(false);

    const handleAlert = () => {
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const getDialogRef = (): MutableRefObject<HTMLDialogElement | null> => {
        if (ref && typeof ref === 'object') {
            return ref as MutableRefObject<HTMLDialogElement | null>;
        }
        return dialogRef;
    };

    const deleteTask = () => {
        getDialogRef().current?.close();
        handleAlert();
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
                            <Button text={"Delete"} onClick={deleteTask} className={cn("h-8 text-lightred hover:bg-lightred hover:bg-opacity-10 hover:text-lightred")}/>
                        </div>
                    </div>
                </Dialog>
            </div>

            {showAlert && (
                <TaskDeletedAlert/>
            )}
        </>
    )
})
DeleteTaskDialog.displayName = "DeleteTaskDialog";