"use client";

import React, {MutableRefObject, useEffect, useState} from "react";
import {CheckCheck} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {cn} from "@/utils/cn";
import {Dialog} from "@marraph/daisy/components/dialog/Dialog";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {
    Alert,
    AlertContent,
    AlertDescription,
    AlertIcon,
    AlertTitle
} from "@marraph/daisy/components/alert/Alert";

const title = "Server api doesnt working"

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    buttonTrigger: boolean;
}

export const CloseTaskDialog = React.forwardRef<HTMLDialogElement, DialogProps>(({ buttonTrigger, className, ...props}, ref) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const [showAlert, setShowAlert] = useState(false);

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

    const closeTask = () => {
        getDialogRef().current?.close();
        setShowAlert(true);
    }

    return (
        <>
            {buttonTrigger &&
                <Button text={"Close"} className={"h-8 mr-2"} onClick={() => {
                    getDialogRef().current?.showModal();
                }}>
                    <CheckCheck size={20} className={"mr-2"}/>
                </Button>
            }

            <div className={"flex items-center justify-center"}>
                <Dialog className={"border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible"} {...props} ref={getDialogRef()}>
                    <div className={"flex flex-row justify-between px-4"}>
                        <div className={"flex flex-col space-y-2"}>
                            <div className={"flex flex-row space-x-2 items-center pt-4"}>
                                <span className={"text-md text-white"}>Close Task:</span>
                                <Badge text={title} className={"font-normal bg-dark text-white rounded-lg"}></Badge>
                            </div>
                            <span className={"text-gray pb-4"}>If you close this task, you can't change properties of the task. Are you sure you want to close this task?</span>
                        </div>
                        <CloseButton className={"h-min w-min mt-4"} onClick={() => getDialogRef().current?.close()}/>
                    </div>
                    <Seperator/>
                    <div className={cn("flex flex-row space-x-2 justify-end px-4 py-2")}>
                        <Button text={"Cancel"} className={cn("h-8")}
                                onClick={() => getDialogRef().current?.close()}/>
                        <Button text={"Close Task"} onClick={closeTask}
                                className={"h-8 text-purple hover:bg-purple hover:bg-opacity-10 hover:text-purple"}/>
                    </div>
                </Dialog>
            </div>

            {showAlert && (
                <Alert duration={3000} className={"fixed bottom-4 right-4 z-50 border border-white border-opacity-20 bg-dark"}>
                    <AlertIcon icon={<CheckCheck />}/>
                    <AlertContent>
                        <AlertTitle title={"Task closed successfully!"}></AlertTitle>
                        <AlertDescription description={"You can no longer interact with this task."}></AlertDescription>
                    </AlertContent>
                </Alert>
            )}
        </>
    );
})
CloseTaskDialog.displayName = "CloseTaskDialog";