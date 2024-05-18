"use client";

import {Dialog} from "@marraph/daisy/components/dialog/Dialog";
import {Button} from "@marraph/daisy/components/button/Button";
import {Trash2} from "lucide-react";
import {cn} from "@/utils/cn";
import React from "react";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";

export const DeleteTaskDialog = React.forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(({className, ...props}) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);

    return (
        <>
            <Button text={""} className={"h-8 text-lightred " +
                "hover:text-lightred hover:bg-lightred hover:bg-opacity-10"}
                onClick={() => dialogRef.current?.showModal()}>
                <Trash2 size={20}/>
            </Button>

            <div className={cn("flex items-center justify-center", className)}>
                <Dialog className={cn("border border-white border-opacity-20 w-1/4 drop-shadow-2xl " +
                    "overflow-visible p-4 space-y-4 flex flex-row", className)}
                    ref={dialogRef} {...props}>
                    <div className={cn("flex flex-col", className)}>
                        <p className={cn("text-white", className)}>Are you sure you want to delete this task?</p>
                        <div className={cn("flex flex-row space-x-2 justify-end", className)}>
                            <Button text={"Delete"}/>
                            <Button text={"Cancel"}/>
                        </div>
                    </div>
                    <CloseButton text={""} className={cn("h-min w-min", className)}
                         onClick={() => dialogRef.current?.close()}/>
                </Dialog>
            </div>

        </>
    )
})
DeleteTaskDialog.displayName = "DeleteTaskDialog";