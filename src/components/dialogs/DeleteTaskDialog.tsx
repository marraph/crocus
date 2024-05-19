"use client";

import {Dialog} from "@marraph/daisy/components/dialog/Dialog";
import {Button} from "@marraph/daisy/components/button/Button";
import {Trash2} from "lucide-react";
import {cn} from "@/utils/cn";
import React from "react";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";

export const DeleteTaskDialog = React.forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(({className, ...props}) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);

    const deleteTask = () => {
        dialogRef.current?.close();
    }

    return (
        <>
            <Button text={""} className={cn("w-min h-8 text-lightred " +
                "hover:text-lightred hover:bg-lightred hover:bg-opacity-10")}
                onClick={() => dialogRef.current?.showModal()}>
                <Trash2 size={20}/>
            </Button>

            <div className={cn("flex items-center justify-center")}>
                <Dialog className={cn("border border-white border-opacity-20 w-3/8 drop-shadow-2xl " +
                    "overflow-visible p-4 space-y-4")}
                        {...props} ref={dialogRef}>
                        <div className={cn("flex flex-col space-y-4")}>
                            <p className={cn("text-white")}>Are you sure you want to delete this task?</p>
                            <div className={cn("flex flex-row space-x-2 justify-end")}>
                                <Button text={"Cancel"} className={cn("h-8")} onClick={() => dialogRef.current?.close()}/>
                                <Button text={"Delete"} onClick={deleteTask}
                                        className={cn("h-8 text-lightred hover:bg-lightred hover:bg-opacity-10 hover:text-lightred")}/>
                            </div>
                        </div>
                </Dialog>
            </div>
        </>
    )
})
DeleteTaskDialog.displayName = "DeleteTaskDialog";