"use client";

import React, {forwardRef, useEffect, useRef, useState} from "react";
import {Dialog, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Alert, AlertContent, AlertIcon, AlertRef, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {Textarea, TextareaRef} from "@marraph/daisy/components/textarea/Textarea";
import {useUser} from "@/context/UserContext";
import {Button} from "@marraph/daisy/components/button/Button";
import {CircleOff, TreePalm} from "lucide-react";
import {cn} from "@/utils/cn";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";
import {DateRangePicker} from "@marraph/daisy/components/daterangepicker/DateRangePicker";

export const CreateAbsenceDialog = forwardRef<DialogRef, React.DialogHTMLAttributes<HTMLDialogElement>>(({ className, ...props}, ref) => {
    const dialogRef = useRef<DialogRef>(null);
    const alertRef = useRef<AlertRef>(null);
    const commentRef = useRef<TextareaRef>(null);
    const absenceRef = useRef<ComboboxRef>(null);
    const [comment, setComment] = useState("");
    const [absence, setAbsence] = useState<string | null>(null);
    const [valid, setValid] = useState<boolean>(false);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    const absenceTypes = ["Vacation", "Sick"];

    useEffect(() => {
        if (user && dialogRef.current && commentRef.current && absenceRef.current) {
            validateInput();
        }
    }, [user, comment, absence]);

    if (!dialogRef) return null;
    if (!user) return null;

    const validateInput = () => {
        if (!absence) {
            setValid(false);
            return;
        }

        setValid(true);
    }

    const handleAbsenceChange = (newAbsence: string) => {
        if (absence === newAbsence) {
            setAbsence(null);
            absenceRef.current?.setValue(null);
        } else {
            setAbsence(newAbsence);
            absenceRef.current?.setValue(newAbsence);
        }
    }

    const createAbsence = () => {
        handleCloseClick();
    }

    const handleCloseClick = () => {
        setComment("");
        setValid(false);
        dialogRef.current?.close();
        commentRef.current?.reset();
        absenceRef.current?.reset();
    }

    return (
        <>
            <Button text={"New Absence"} theme={"dark"} className={"w-min h-8"} onClick={() => dialogRef.current?.show()}>
                <TreePalm size={20} className={"mr-2"}/>
            </Button>

            <div className={cn("flex items-center justify-center")}>
                <Dialog className={cn("border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible space-y-2")} {...props} ref={dialogRef}>
                    <div className={"flex flex-row justify-between items-center space-x-4 pt-4 pb-2 px-4"}>
                        <span className={"text-white text-lg"}>{"Create a new absence"}</span>
                        <CloseButton className={cn("h-min w-min", className)} onClick={handleCloseClick}/>
                    </div>

                    <Textarea placeholder={"Comment"} className={"px-4 h-12 w-full bg-black placeholder-placeholder focus:text-gray"} spellCheck={false}
                              onChange={(e) => setComment(e.target.value)} value={comment} ref={commentRef}>
                    </Textarea>

                    <div className={"flex flex-row items-center space-x-2 px-4 py-2"}>
                        <Combobox buttonTitle={"Absence type"} icon={<CircleOff size={14} className={"mr-2"}/>} ref={absenceRef}>
                            {absenceTypes.map(((absence, index) =>
                                <ComboboxItem key={index} title={absence} onClick={() => handleAbsenceChange(absence)}/>
                            ))}
                        </Combobox>
                        <DateRangePicker text={"Select your absence time"} iconSize={16} closeButton={false}/>
                    </div>

                    <Seperator/>
                    <div className={cn("flex flex-row items-center justify-end space-x-16 px-4 py-2", className)}>
                        <Button text={"Create"} theme={"white"} onClick={createAbsence} disabled={!valid}
                                className={cn("w-min h-8", className)}>
                        </Button>
                    </div>
                </Dialog>
            </div>

            <Alert duration={3000} ref={alertRef}>
                <AlertIcon icon={<TreePalm/>}/>
                <AlertContent>
                    <AlertTitle title={"Time Entry created successfully!"}></AlertTitle>
                </AlertContent>
            </Alert>
        </>
    );
})
CreateAbsenceDialog.displayName = "CreateAbsenceDialog";