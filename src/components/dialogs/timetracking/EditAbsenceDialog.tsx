"use client";

import React, {ChangeEvent, forwardRef, useCallback, useEffect, useMemo, useState} from "react";
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

export const EditAbsenceDialog = forwardRef<DialogRef, { absence: Absence }>(({ absence }, ref) => {
    const dialogRef = mutateRef(ref);

    const initialValues: InitialValues = useMemo(() => ({
        comment: absence.comment ?? "",
        absenceType: absence.absenceType,
        dateRange: { from: absence.startDate, to: absence.endDate },
    }), [absence]);

    const [values, setValues] = useState(initialValues);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const [valid, setValid] = useState<boolean>(true);
    const absenceTypes = useMemo(() => ["VACATION", "SICK"], []);
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const {addToast} = useToast();

    const validate = useCallback(() => {
        if (values === initialValues) {
            setValid(false);
            return;
        }
        
        setValid(values.absenceType === "SICK" || values.absenceType === "VACATION");
    }, [initialValues, values]);

    useEffect(() => {
        validate();
    }, [validate, values.absenceType]);

    const handleEditClick = useCallback(() => {
        if (!user) return;
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
    }, [user, absence.id, absence.createdBy, absence.createdDate, values.dateRange.from, values.dateRange.to, values.comment, values.absenceType, addToast]);

    const handleInputChange = useCallback((field: keyof InitialValues, setValues: React.Dispatch<React.SetStateAction<InitialValues>>) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: e.target.value
        }));
    }, []);

    const handleCloseClick = useCallback(() => {
        setValid(true);
        setDialogKey(Date.now());
        setValues(initialValues);
    }, [initialValues]);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={800}
                onClose={handleCloseClick}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"Edit absence"}/>
            <DialogContent>
                <Textarea placeholder={"Comment"}
                          label={"Comment"}
                          className={"px-2 h-12 w-full bg-black placeholder-placeholder focus:text-gray"}
                          spellCheck={false}
                          onChange={handleInputChange("comment", setValues)}
                          value={values.comment}
                />

                <div className={"flex flex-row items-center space-x-2 py-4"}>
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
                          onClick={handleEditClick}
                          disabledButton={!valid}
            />
        </Dialog>
    );
});
EditAbsenceDialog.displayName = "EditAbsenceDialog";