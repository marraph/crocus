"use client";

import React, {forwardRef, useEffect, useRef, useState} from "react";
import {TimeEntry} from "@/types/types";
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
import {useUser} from "@/context/UserContext";
import {deleteTask} from "@/service/hooks/taskHook";
import {cn} from "@/utils/cn";
import {Button} from "@marraph/daisy/components/button/Button";
import {Trash2, Users} from "lucide-react";
import {Input, InputRef} from "@marraph/daisy/components/input/Input";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {}

export const JoinTeamDialog = forwardRef<DialogRef, DialogProps>(({ className, ...props}, ref) => {
    const dialogRef = mutateRef(ref);
    const inputRef = useRef<InputRef>(null);
    const alertRef = useRef<AlertRef>(null);
    const [link, setLink] = useState<string>("");
    const [valid, setValid] = useState<boolean>(false);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    useEffect(() => {
        if (user && inputRef.current) {
            validate();
        }
    }, [user, link]);

    if (!dialogRef) return null;
    if (!user) return null;

    const validate = () => {
        if (link.trim() === "") {
            setValid(false);
            return;
        }
        setValid(true);
    }

    const close = () => {
        dialogRef.current?.close();
        inputRef.current?.reset();
        setValid(false);
        setLink("");
    }

    const joinTeam = () => {
        alertRef.current?.show();
        close();
    }

    return (
        <>
            <div className={cn("flex items-center justify-center")}>
                <Dialog className={cn("border border-white border-opacity-20 w-2/5 drop-shadow-lg overflow-visible space-y-2")} {...props} ref={dialogRef}>
                    <div className={cn("flex flex-col space-y-2")}>
                        <span className={"text-white text-lg p-4"}>{"Join a team"}</span>
                        <span className={"text-sm text-gray px-4"}>
                            {"You can join a team by inserting a invite link in the correct format."}
                        </span>
                        <Input placeholder={"app.luna.io/invite/xxxx-xxxx-xxxx"}
                               className={"w-full px-2 pb-2"}
                               value={link}
                                 onChange={(e) => setLink(e.target.value)}
                               ref={inputRef}
                        />

                        <Seperator/>

                        <div className={cn("flex flex-row space-x-2 justify-end px-4 pb-2")}>
                            <Button text={"Cancel"} className={cn("h-8")} onClick={() => close}/>
                            <Button text={"Join"} theme={"white"} className={cn("h-8")}
                                    onClick={() => joinTeam} disabled={!valid}/>
                        </div>
                    </div>
                </Dialog>
            </div>

            <Alert duration={3000} ref={alertRef}>
                <AlertIcon icon={<Users color="#F55050" />}/>
                <AlertContent>
                    <AlertTitle title={"Joined Team successfully!"}></AlertTitle>
                </AlertContent>
            </Alert>
        </>
    )
})
JoinTeamDialog.displayName = "JoinTeamDialog";