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

type EditProps = Pick<Absence, "comment" | "absenceType" | "startDate" | "endDate">;

export const EditAbsenceDialog = forwardRef<DialogRef, { absence: Absence }>(({ absence }, ref) => {
    const dialogRef = mutateRef(ref);
    const [values, setValues] = useState<EditProps>({
        comment: absence.comment ?? "",
        absenceType: absence.absenceType,
        startDate: absence.startDate,
        endDate: absence.endDate,
    });
    const initialValues = values;
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
        
        const newAbsence: Partial<Absence> = {
            startDate: values.startDate ?? new Date(),
            endDate: values.endDate ?? new Date(),
            comment: values.comment,
            absenceType: values.absenceType as AbsenceType,
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
        };
        
        const { data, isLoading, error } = updateAbsence(absence.id, { ...absence, ...newAbsence });

        addToast({
            title: "Saved changes",
            secondTitle: "You successfully saved your absence changes.",
            icon: <Save/>,
        });
    }, [user, values.startDate, values.endDate, values.comment, values.absenceType, absence, addToast]);

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
                          onChange={(e) => setValues((prevValues) => ({ ...prevValues, comment: e.target.value }))}
                          value={values.comment ?? ""}
                />

                <div className={"flex flex-row items-center space-x-2 py-4"}>
                    <DateRangePicker
                        text={"Select a date"}
                        label={"Date Range"}
                        size={"medium"}
                        closeButton={false}
                        dayFormat={"long"}
                        preSelectedRange={{ from: values.startDate ?? null, to: values.endDate ?? null }}
                        onRangeChange={(range) => setValues((prevValues) => ({ ...prevValues, dateRange: range ?? { from: new Date(), to: new Date() } }))}
                    />
                    <Combobox buttonTitle={"Absence Type"}
                              label={"Absence Type"}
                              icon={<TreePalm size={16} className={"mr-2"}/>}
                              preSelectedValue={values.absenceType}
                              getItemTitle={(item) => item as string}
                              onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, absenceType: value as AbsenceType }))}
                    >
                        {absenceTypes.map((type) => (
                            <ComboboxItem key={type} title={type} value={type}/>
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