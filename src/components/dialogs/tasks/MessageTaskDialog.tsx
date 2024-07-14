import React, {forwardRef, useRef, useState} from "react";
import {MessageSquarePlus} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {Alert, AlertRef} from "@marraph/daisy/components/alert/Alert";
import {mutateRef} from "@/utils/mutateRef";
import {TaskElement} from "@/types/types";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    taskElement: TaskElement;
}

export const MessageTaskDialog = forwardRef<DialogRef, DialogProps>(({ taskElement }, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const [dialogKey, setDialogKey] = useState(Date.now());

    if (!dialogRef) return null;

    const sendMessage = () => {
        alertRef.current?.show();
    }

    const handleClose = () => {
        setDialogKey(Date.now());
    }

    return (
        <>
            <Dialog width={600}
                    ref={dialogRef}
                    key={dialogKey}
            >
                <DialogHeader title={"New Message"}
                              dialogRef={dialogRef}
                              onClose={handleClose}
                />
                <DialogContent>
                    <Textarea placeholder={"Write your message..."}
                              className={"h-20 w-full bg-black placeholder-marcador"}
                    />
                </DialogContent>
                <DialogFooter saveButtonTitle={"Send"}
                              cancelButton={true}
                              switchButton={false}
                              dialogRef={dialogRef}
                              onClick={sendMessage}
                              onClose={handleClose}
                />
            </Dialog>

            <Alert title={"Added Message"}
                   description={"You successfully added your message to the auditlog."}
                   icon={<MessageSquarePlus />}
                   duration={3000}
                   ref={alertRef}
                   closeButton={false}
            />
        </>

    )
})
MessageTaskDialog.displayName = "MessageTaskDialog";