"use client";

import React, {useState} from "react";
import {CheckCheck} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {cn} from "@/utils/cn";
import {Dialog, DialogSeperator} from "@marraph/daisy/components/dialog/Dialog";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {TaskClosedAlert} from "@/components/alerts/TaskClosedAlert";

const title = "Server api doesnt working"

export const CloseTaskDialog = React.forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(({className, ...props}) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const [showAlert, setShowAlert] = useState(false);

    const handleAlert = () => {
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const closeTask = () => {
        dialogRef.current?.close();
        handleAlert();
    }

    return (
        <>
            <Button text={"Close"} className={"h-8 mr-2"} onClick={() => dialogRef.current?.showModal()}>
                <CheckCheck size={20} className={"mr-2"}/>
            </Button>

            <div className={"flex items-center justify-center"}>
                <Dialog className={"border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible"} {...props} ref={dialogRef}>
                    <div className={"flex flex-row justify-between px-4"}>
                        <div className={"flex flex-col space-y-2"}>
                            <div className={"flex flex-row space-x-2 items-center pt-4"}>
                                <span className={"text-md text-white"}>Close Task:</span>
                                <Badge text={title} className={"font-normal bg-dark text-white rounded-lg"}></Badge>
                            </div>
                            <span className={"text-gray pb-4"}>If you close this task, you can't change properties of the task. Are you sure you want to close this task?</span>
                        </div>
                        <CloseButton className={"h-min w-min mt-4"} onClick={() => dialogRef.current?.close()}/>
                    </div>
                    <DialogSeperator/>
                    <div className={cn("flex flex-row space-x-2 justify-end px-4 py-2")}>
                        <Button text={"Cancel"} className={cn("h-8")}
                                onClick={() => dialogRef.current?.close()}/>
                        <Button text={"Close Task"} onClick={closeTask}
                                className={"h-8 text-purple hover:bg-purple hover:bg-opacity-10 hover:text-purple"}/>
                    </div>
                </Dialog>
            </div>

            {showAlert && (
                <TaskClosedAlert/>
            )}
        </>
    );
})
CloseTaskDialog.displayName = "CloseTaskDialog";