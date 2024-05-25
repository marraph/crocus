"use client";

import React from "react";
import {Pencil} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {Dialog, DialogSeperator} from "@marraph/daisy/components/dialog/Dialog";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {cn} from "@/utils/cn";

const title = "Server api doesnt work"

export const EditTaskDialog = React.forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(({className, ...props}) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);

    const editTask = () => {
        dialogRef.current?.close();
    }

    return (
        <>
            <Button text={"Edit"} className={"h-8 mr-2"} onClick={() => dialogRef.current?.showModal()}>
                <Pencil size={16} className={"mr-2"}/>
            </Button>

            <div className={"flex items-center justify-center"}>
                <Dialog
                    className={"border border-white border-opacity-20 w-1/3 drop-shadow-2xl overflow-visible"} {...props}
                    ref={dialogRef}>
                    <div className={"flex flex-row justify-between px-4"}>
                        <div className={"flex flex-col space-y-2"}>
                            <div className={"flex flex-row justify-between space-x-2 items-center pt-4"}>
                                <span className={"text-md text-white"}>Edit Task:</span>
                                <Badge text={title} className={"flex justify-end font-normal bg-dark text-white rounded-lg"}></Badge>
                            </div>



                            <span className={"text-white"}>Properties</span>
                        </div>
                        <CloseButton text={""} className={"h-min w-min mt-4"}
                                     onClick={() => dialogRef.current?.close()}/>
                    </div>
                    <DialogSeperator/>
                    <div className={cn("flex flex-row space-x-2 justify-end px-4 py-2")}>
                        <Button text={"Cancel"} className={cn("h-8")}
                                onClick={() => dialogRef.current?.close()}/>
                        <Button text={"Save changes"} theme={"white"} onClick={editTask}
                                className={"h-8"}/>
                    </div>
                </Dialog>
            </div>
        </>
    )
})
EditTaskDialog.displayName = "EditTaskDialog";

