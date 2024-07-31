"use client";

import React, {ChangeEvent, forwardRef, useEffect, useMemo, useState} from "react";
import {Absence, AbsenceType} from "@/types/types";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {mutateRef} from "@/utils/mutateRef";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {useUser} from "@/context/UserContext";
import {Save, TreePalm} from "lucide-react";
import {DateRangePicker} from "@marraph/daisy/components/daterangepicker/DateRangePicker";
import {DateRange} from "react-day-picker";
import {updateAbsence} from "@/service/hooks/absenceHook";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {useToast} from "griller/src/component/toaster";

type InitialValues = {
    comment: string;
    absenceType: string;
    dateRange: DateRange;
};

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    absence: Absence;
}

export const EditAbsenceDialog = forwardRef<DialogRef, DialogProps>(({ absence, className, ...props}, ref) => {
    const dialogRef = mutateRef(ref);

    const initialValues: InitialValues = {
        comment: absence.comment ?? "",
        absenceType: absence.absenceType,
        dateRange: { from: absence.startDate, to: absence.endDate },
    };

    const [values, setValues] = useState(initialValues);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const [valid, setValid] = useState<boolean>(true);
    const absenceTypes = useMemo(() => ["VACATION", "SICK"], []);
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const {addToast} = useToast();

    useEffect(() => {
        validate();
    }, [values.absenceType]);

    if (!dialogRef || user === undefined) return null;

    const editAbsence = () => {
        const newAbsence: Absence = {
            id: absence.id,
            startDate: values.dateRange.from ?? new Date(),
            endDate: values.dateRange.to ?? new Date(),
            comment: values.comment,
            absenceType: values.absenceType as AbsenceType,
            createdBy: absence.createdBy,
            createdDate: absence.createdDate,
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
        };
        const { data, isLoading, error } = updateAbsence(absence.id, newAbsence);

        addToast({
            title: "Saved changes",
            secondTitle: "You successfully saved your absence changes.",
            icon: <Save/>,
        });
    };

    const handleInputChange = (field: keyof InitialValues, setValues: React.Dispatch<React.SetStateAction<InitialValues>>) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: e.target.value
        }));
    };

    const handleCloseClick = () => {
        setValid(true);
        setDialogKey(Date.now());
        setValues(initialValues);
    };

    const validate = () => {
        setValid(values.absenceType === "SICK" || values.absenceType === "VACATION");
    }

    return (
        <Dialog width={800}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"Edit absence"}
                          dialogRef={dialogRef}
                          onClose={handleCloseClick}
            />
            <DialogContent>
                <Textarea placeholder={"Comment"}
                          label={"Comment"}
                          className={"px-4 h-12 w-full bg-black placeholder-placeholder focus:text-gray"}
                          spellCheck={false}
                          onChange={handleInputChange("comment", setValues)}
                          value={values.comment}
                />

                <div className={"flex flex-row items-center space-x-2 px-4 pb-2"}>
                    <DateRangePicker text={"Select a date"}
                                     label={"Date Range"}
                                     size={"medium"}
                                     closeButton={false}
                                     dayFormat={"long"}
                                     preSelectedRange={values.dateRange}
                                     onRangeChange={(range) =>
                                         setValues((prevValues) => ({ ...prevValues, dateRange: range ?? { from: new Date(), to: new Date() } }))}
                    />
                    <Combobox buttonTitle={"Absence Type"}
                              label={"Absence Type"}
                              icon={<TreePalm size={16} className={"mr-2"}/>}
                              preSelectedValue={values.absenceType}
                              onValueChange={(value) =>
                                  setValues((prevValues) => ({ ...prevValues, absenceType: value ?? "" }))}
                    >
                        {absenceTypes.map((type) => (
                            <ComboboxItem key={type} title={type}/>
                        ))}
                    </Combobox>
                </div>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Save changes"}
                          cancelButton={true}
                          switchButton={false}
                          dialogRef={dialogRef}
                          onClick={editAbsence}
                          onClose={handleCloseClick}
                          disabledButton={!valid}
            />
        </Dialog>
    );
});
EditAbsenceDialog.displayName = "EditAbsenceDialog";