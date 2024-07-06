import React, {forwardRef, useRef} from "react";
import {MessageSquarePlus} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {
    Alert,
    AlertContent,
    AlertDescription,
    AlertIcon,
    AlertRef,
    AlertTitle
} from "@marraph/daisy/components/alert/Alert";
import {mutateRef} from "@/utils/mutateRef";
import {TaskElement} from "@/types/types";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    taskElement: TaskElement;
}

export const MessageTaskDialog = forwardRef<DialogRef, DialogProps>(({ taskElement }, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);

    if (!dialogRef) return null;

    const sendMessage = () => {
        alertRef.current?.show();
    }

    return (
        <>
            <Dialog width={600} ref={dialogRef}>
                <DialogHeader title={"New Message"}
                              dialogRef={dialogRef}
                />
                <DialogContent>
                    <Textarea placeholder={"Write your message..."}
                              className={"h-20 w-full bg-black placeholder-placeholder"}
                    />
                </DialogContent>
                <DialogFooter saveButtonTitle={"Send"}
                              cancelButton={true}
                              switchButton={false}
                              dialogRef={dialogRef}
                              onClick={sendMessage}
                />
            </Dialog>

            <Alert duration={3000} ref={alertRef} closeButton={false}>
                <AlertIcon icon={<MessageSquarePlus />}/>
                <AlertContent>
                    <AlertTitle title={"Added Message"}></AlertTitle>
                    <AlertDescription description={"You successfully added your message to the auditlog."}></AlertDescription>
                </AlertContent>
            </Alert>
        </>

    )
})
MessageTaskDialog.displayName = "MessageTaskDialog";