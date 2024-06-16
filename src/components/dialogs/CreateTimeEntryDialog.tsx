import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {cn} from "@/utils/cn";
import {Dialog} from "@marraph/daisy/components/dialog/Dialog";
import {Alert, AlertContent, AlertIcon, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {AlarmClockPlus} from "lucide-react";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";

export const CreateTimeEntryDialog = React.forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(({ className, ...props}, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
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

    const createTimeEntry = () => {
        getDialogRef().current?.close();
        setShowAlert(true);
    }

    const handleCloseClick = () => {
        getDialogRef().current?.close();
    }

    return (
        <>
            <Button text={"New Entry"} theme={"white"} onClick={() => getDialogRef().current?.showModal()}/>

            <div className={cn("flex items-center justify-center")}>
                <Dialog className={cn("border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible p-4 space-y-4")} {...props} ref={getDialogRef()}>
                    <div className={cn("flex flex-row justify-between space-x-4 px-4 pt-4 pb-2", className)}>
                        <div className={cn("flex flex-col flex-grow space-y-2", className)}>



                        </div>
                        <CloseButton className={cn("h-min w-min", className)} onClick={handleCloseClick}/>
                    </div>
                    <Seperator/>
                    <div className={cn("flex flex-row justify-end px-4 py-2", className)}>
                        <Button text={"Create"} theme={"white"} onClick={createTimeEntry} //disabled={titleValue.trim() === ""}
                                className={cn("w-min h-8 disabled:cursor-not-allowed disabled:hover:none disabled:bg-dark disabled:text-gray", className)}>
                        </Button>
                    </div>
                </Dialog>
            </div>

            {showAlert && (
                <Alert duration={3000}
                       className={"fixed bottom-4 right-4 z-50 border border-white border-opacity-20 bg-dark"}>
                    <AlertIcon icon={<AlarmClockPlus/>}/>
                    <AlertContent>
                        <AlertTitle title={"Time Entry created successfully!"}></AlertTitle>
                    </AlertContent>
                </Alert>
            )}
        </>
    );
})
CreateTimeEntryDialog.displayName = "CreateTimeEntryDialog";