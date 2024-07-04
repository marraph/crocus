"use client";

import React, {forwardRef, useEffect, useRef, useState} from "react";
import {Absence, AbsenceType, Project, Task, TimeEntry} from "@/types/types";
import {Dialog, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {mutateRef} from "@/utils/mutateRef";
import {
    Alert,
    AlertContent,
    AlertDescription,
    AlertIcon,
    AlertRef,
    AlertTitle
} from "@marraph/daisy/components/alert/Alert";
import {Textarea, TextareaRef} from "@marraph/daisy/components/textarea/Textarea";
import {SearchSelect, SearchSelectItem, SearchSelectRef} from "@marraph/daisy/components/searchselect/SearchSelect";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {useUser} from "@/context/UserContext";
import {formatTimeAMPM} from "@/utils/format";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {BookCopy, ClipboardList, Clock2, Clock8, Save, TreePalm, Users} from "lucide-react";
import {getAllProjects, getAllTasks, getProjectFromTask, getTasksFromProject, getTeams} from "@/utils/getTypes";
import {cn} from "@/utils/cn";
import {Button} from "@marraph/daisy/components/button/Button";
import {DateRangePicker, DateRangePickerRef} from "@marraph/daisy/components/daterangepicker/DateRangePicker";
import {DateRange} from "react-day-picker";
import {updateAbsence} from "@/service/hooks/absenceHook";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    absence: Absence;
}

export const EditAbsenceDialog = forwardRef<DialogRef, DialogProps>(({ absence, className, ...props}, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const commentRef = useRef<TextareaRef>(null);
    const absenceRef = useRef<ComboboxRef>(null);
    const dateRef = useRef<DateRangePickerRef>(null);
    const [comment, setComment] = useState<string | null>(absence.comment);
    const [absenceType, setAbsenceType] = useState<string | null>(absence.absenceType.toString());
    const [valid, setValid] = useState<boolean>(true);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    if (!user) return null;
    if (!dialogRef) return null;

    const absenceTypes = ["VACATION", "SICK"];

    const editAbsence = () => {
        const newAbsence: Absence = {
            id: absence.id,
            startDate: dateRef.current?.getSelectedValue()?.from ?? absence.startDate,
            endDate: dateRef.current?.getSelectedValue()?.to ?? absence.endDate,
            comment: comment ?? null,
            absenceType: absenceRef.current?.getValue() as AbsenceType,
            createdBy: absence.createdBy,
            createdDate: absence.createdDate,
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
        };
        const { data, isLoading, error } = updateAbsence(absence.id, newAbsence);

        dialogRef.current?.close();
        alertRef.current?.show();
    };

    const handleCloseClick = () => {
        setComment("");
        dialogRef.current?.close();
        commentRef.current?.setValue(comment ?? "");
        absenceRef.current?.setValue(absenceType);
        const dateRange: DateRange = { from: absence.startDate, to: absence.endDate };
        dateRef.current?.setValue(dateRange ?? null);
    };

    const handleAbsenceTypeChange = (type: string) => {

        if (type === absenceType){
            setAbsenceType(null);
            absenceRef.current?.setValue(null);
        } else {
            setAbsenceType(type);
            absenceRef.current?.setValue(type);
        }
    };

    return (
        <>
            <div className={"flex items-center justify-center"}>
                <Dialog className={"border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible"} {...props} ref={dialogRef}>
                    <div className={"flex flex-row justify-between px-4 pb-2"}>
                        <span className={"text-md text-white pt-4"}>Edit absence</span>
                        <CloseButton className={"h-min w-min mt-4"} onClick={() => handleCloseClick()} />
                    </div>
                    <Seperator />

                    <Textarea placeholder={"Comment"} className={"px-4 h-12 w-full bg-black placeholder-placeholder focus:text-gray"} spellCheck={false}
                              onChange={(e) => setComment(e.target.value)} value={comment ?? undefined}
                              ref={commentRef}>
                    </Textarea>

                    <div className={"flex flex-row items-center space-x-2 px-4 pb-2"}>
                        <DateRangePicker text={"Select a date"} iconSize={16} ref={dateRef} size={"medium"}
                                         closeButton={false} dayFormat={"long"}/>
                        <Combobox buttonTitle={"Absence Type"} icon={<TreePalm size={16} className={"mr-2"}/>} ref={absenceRef}
                                  preSelectedValue={absence.absenceType} onChange={() => handleAbsenceTypeChange}>
                            {absenceTypes.map((type) => (
                                <ComboboxItem key={type} title={type} onClick={() => handleAbsenceTypeChange(type)}/>
                            ))}
                        </Combobox>
                    </div>


                    <Seperator/>
                    <div className={cn("flex flex-row space-x-2 justify-end px-4 py-2")}>
                        <Button text={"Cancel"} className={cn("h-8")} onClick={() => handleCloseClick()}/>
                        <Button text={"Save changes"} theme={"white"}
                                onClick={editAbsence} disabled={!valid}
                                className={"h-8"}/>
                    </div>
                </Dialog>
            </div>

            <Alert duration={3000} ref={alertRef} closeButton={false}>
                <AlertIcon icon={<Save/>}/>
                <AlertContent>
                    <AlertTitle title={"Saved changes"}></AlertTitle>
                    <AlertDescription description={"You successfully saved your absence changes."}></AlertDescription>
                </AlertContent>
            </Alert>
        </>
    );
});
EditAbsenceDialog.displayName = "EditAbsenceDialog";