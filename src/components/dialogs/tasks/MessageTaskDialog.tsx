import React, {forwardRef, useRef} from "react";
import {MessageSquare, MessageSquarePlus, Send} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {cn} from "@/utils/cn";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Dialog, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {
    Alert,
    AlertContent,
    AlertDescription,
    AlertIcon,
    AlertRef,
    AlertTitle
} from "@marraph/daisy/components/alert/Alert";

export const MessageTaskDialog = forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(({className, ...props}) => {
    const dialogRef = React.useRef<DialogRef>(null);
    const alertRef = useRef<AlertRef>(null);

    const sendMessage = () => {
        dialogRef.current?.close();
        alertRef.current?.show();
    }

    return (
        <>
            <Button text={"Message"} theme={"white"} className={"h-8 mr-2"} onClick={() => dialogRef.current?.show()}>
                <MessageSquare size={20} className={"mr-2"}/>
            </Button>

            <div className={cn("flex items-center justify-center")}>
                <Dialog className={"border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible"} {...props} ref={dialogRef}>
                    <div className={"flex flex-row justify-between space-x-2 px-4"}>
                        <div className={"flex flex-col w-full space-y-2 "}>
                            <span className={"text-md text-white pt-4"}>New Message</span>
                            <Textarea placeholder={"Write your message..."} className={"h-20 w-full bg-black placeholder-placeholder"}/>
                        </div>
                        <CloseButton className={"h-min w-min mt-4"} onClick={() => dialogRef.current?.close()}/>
                    </div>
                    <Seperator/>
                    <div className={cn("flex flex-row space-x-2 justify-end px-4 py-2")}>
                        <Button text={"Cancel"} className={cn("h-8")} onClick={() => dialogRef.current?.close()}/>
                        <Button text={"Send"} theme={"white"} onClick={sendMessage} className={"h-8"}>
                            <Send size={16} className={"mr-1"}/>
                        </Button>
                    </div>
                </Dialog>
            </div>

            <Alert duration={3000} ref={alertRef}>
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