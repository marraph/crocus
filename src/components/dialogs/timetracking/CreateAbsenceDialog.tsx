"use client";

import React, {ChangeEvent, forwardRef, useCallback, useEffect, useMemo, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {useUser} from "@/context/UserContext";
import {CircleOff, TreePalm} from "lucide-react";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {DateRangePicker} from "@marraph/daisy/components/daterangepicker/DateRangePicker";
import {Absence, AbsenceType} from "@/types/types";
import {createAbsence} from "@/service/hooks/absenceHook";
import {DateRange} from "react-day-picker";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";

type InitialValues = {
    comment: string,
    absenceType: string,
    dateRange: DateRange,
}

export const CreateAbsenceDialog = forwardRef<DialogRef>(({}, ref) => {
    const dialogRef = mutateRef(ref);

    const initialValues: InitialValues = useMemo(() => ({
        comment: "",
        absenceType: "",
        dateRange: {
            from: new Date(),
            to: new Date()
        }
    }), []);

    const [values, setValues] = useState(initialValues);
    const [valid, setValid] = useState<boolean>(false);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const {addToast} = useToast();

    const absenceTypes = useMemo(() => ["VACATION", "SICK"], []);

    useEffect(() => {
        validateInput();
    }, [values.absenceType]);


    const validateInput = useCallback(() => {
        setValid(values.absenceType === "VACATION" || values.absenceType === "SICK");
    }, [values.absenceType]);

    const handleCreateClick = useCallback(() => {
        if (!user) return;
        const newAbsence: Absence = {
            id: 0,
            startDate: values.dateRange.from ?? new Date(),
            endDate: values.dateRange.to ?? new Date(),
            comment: values.comment,
            absenceType: values.absenceType as AbsenceType,
            createdBy: {id: user.id, name: user.name, email: user.email},
            createdDate: new Date(),
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
        }
        const { data, isLoading, error } = createAbsence(newAbsence);
        handleCloseClick();
        addToast({
            title: "Absence created successfully!",
            icon: <TreePalm/>,
        })
    }, [values, user]);

    const handleCloseClick = useCallback(() => {
        setValues(initialValues);
        setValid(false);
        setDialogKey(Date.now());
    }, [initialValues]);

    const handleInputChange = useCallback((field: keyof InitialValues, setValues: React.Dispatch<React.SetStateAction<InitialValues>>) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: e.target.value
        }));
    }, []);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={600}
                onClose={handleCloseClick}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"New absence"}/>
            <DialogContent>
                <Textarea placeholder={"Comment"}
                          className={"h-12 w-full bg-black placeholder-marcador focus:text-gray"}
                          spellCheck={false}
                          onChange={handleInputChange("comment", setValues)}
                          value={values.comment}
                >
                </Textarea>
                <div className={"flex flex-row items-center space-x-2 py-2"}>
                    <Combobox buttonTitle={"Absence Type"}
                              icon={<CircleOff size={14} className={"mr-2"}/>}
                              onValueChange={(value) =>
                                  setValues((prevValues) => ({ ...prevValues, absenceType: value ?? "" }))}
                    >
                        {absenceTypes.map(((absence, index) =>
                                <ComboboxItem key={index}
                                              title={absence}
                                />
                        ))}
                    </Combobox>
                    <DateRangePicker text={"Select your absence time"}
                                     closeButton={false}
                                     dayFormat={"long"}
                                     onRangeChange={(value) =>
                                         setValues((prevValues) => ({ ...prevValues, dateRange: value ?? {from: new Date(), to: new Date()} }))}
                    />
                </div>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Create"}
                          disabledButton={!valid}
                          onClick={handleCreateClick}
            />
        </Dialog>
    );
})
CreateAbsenceDialog.displayName = "CreateAbsenceDialog";