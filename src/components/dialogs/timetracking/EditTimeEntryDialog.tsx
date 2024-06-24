"use client";

import React, {forwardRef, useEffect, useRef, useState} from "react";
import {BookCopy, CircleAlert, Hourglass, LineChart, Pencil, Save, Tag, Users} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {Dialog, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {cn} from "@/utils/cn";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {
    Alert,
    AlertContent,
    AlertDescription,
    AlertIcon,
    AlertRef,
    AlertTitle
} from "@marraph/daisy/components/alert/Alert";
import {Priority, Project, Status, Task, TaskElement, Team, TimeEntry} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {Textarea, TextareaRef} from "@marraph/daisy/components/textarea/Textarea";
import {Input, InputRef} from "@marraph/daisy/components/input/Input";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    timeEntry: TimeEntry;
}

export const EditTimeEntryDialog = forwardRef<HTMLDialogElement, DialogProps>(({ timeEntry, className, ...props}, ref) => {
    const dialogRef = useRef<DialogRef>(null);
    const alertRef = useRef<AlertRef>(null);
    const [valid, setValid] = useState(true);
    const { data, isLoading, error } = useUser();

    if (!data) return null;

    const editTimeEntry = () => {
    };


    const handleCloseClick = () => {
    };

    return (
        <>
            <div className={"flex items-center justify-center"}>
                <Dialog className={"border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible"} {...props} ref={dialogRef}>
                    <div className={"flex flex-row justify-between px-4 pb-2"}>
                        <span className={"text-md text-white pt-4"}>Edit TimeEntry</span>
                        <CloseButton className={"h-min w-min mt-4"} onClick={() => handleCloseClick()} />
                    </div>
                    <Seperator />



                    <Seperator/>
                    <div className={cn("flex flex-row space-x-2 justify-end px-4 py-2")}>
                        <Button text={"Cancel"} className={cn("h-8")} onClick={() => handleCloseClick()}/>
                        <Button text={"Save changes"} theme={"white"}
                                onClick={editTimeEntry} disabled={!valid}
                                className={"h-8 disabled:cursor-not-allowed disabled:hover:none disabled:bg-dark disabled:text-gray"}/>
                    </div>
                </Dialog>
            </div>

            <Alert duration={3000} ref={alertRef}>
                <AlertIcon icon={<Save/>}/>
                <AlertContent>
                    <AlertTitle title={"Saved changes"}></AlertTitle>
                    <AlertDescription description={"You successfully saved your task changes."}></AlertDescription>
                </AlertContent>
            </Alert>
        </>
    );
});
EditTimeEntryDialog.displayName = "EditTimeEntryDialog";