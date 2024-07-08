"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Button} from "@marraph/daisy/components/button/Button";
import {Trash2} from "lucide-react";
import {cn} from "@/utils/cn";
import React, {forwardRef, useRef} from "react";
import {
    Alert,
    AlertContent,
    AlertDescription,
    AlertIcon,
    AlertRef,
    AlertTitle
} from "@marraph/daisy/components/alert/Alert";
import {Absence, TimeEntry} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {mutateRef} from "@/utils/mutateRef";
import {deleteTimeEntry} from "@/service/hooks/timeentryHook";
import {deleteAbsence} from "@/service/hooks/absenceHook";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    timeEntry?: TimeEntry;
    absence?: Absence;
}

export const DeleteTimeEntryDialog = forwardRef<DialogRef, DialogProps>(({ timeEntry, absence, className, ...props}, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const { data:user, isLoading:userLoading, error:userError } = useUser();

    if (!timeEntry && !absence) return null;
    if (!dialogRef || user === undefined) return null;

    const deleteEntry = () => {
        if (timeEntry)  {
            const {wasSuccessful, isLoading, error} = deleteTimeEntry(timeEntry.id);
        }
        if (absence) {
            const {wasSuccessful, isLoading, error} = deleteAbsence(absence.id);
        }
        alertRef.current?.show();
    }

    return (
        <>
            <Dialog width={600}
                    ref={dialogRef}
            >
                <DialogHeader title={"Delete " + (timeEntry ? "entry" : "absence")}
                              dialogRef={dialogRef}
                />
                <DialogContent>
                    <span className={cn("text-white")}>
                        {"Are you sure you want to delete this " + (timeEntry ? "TimeEntry" : "Absence") + "?"}
                    </span>
                </DialogContent>
                <DialogFooter saveButtonTitle={"Delete"}
                              cancelButton={true}
                              switchButton={false}
                              dialogRef={dialogRef}
                              onClick={deleteEntry}
                />
            </Dialog>

            <Alert duration={3000} ref={alertRef} closeButton={false}>
                <AlertIcon icon={<Trash2 color="#F55050" />}/>
                <AlertContent>
                    <AlertTitle title={(timeEntry ? "TimeEntry" : "Absence") + " deleted successfully!"}></AlertTitle>
                    <AlertDescription description={"You can no longer interact with this " + (timeEntry ? "TimeEntry" : "Absence") + "."}></AlertDescription>
                </AlertContent>
            </Alert>
        </>
    )
})
DeleteTimeEntryDialog.displayName = "DeleteTimeEntryDialog";