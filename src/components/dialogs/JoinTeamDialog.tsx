"use client";

import React, {DialogHTMLAttributes, forwardRef, useEffect, useRef, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {mutateRef} from "@/utils/mutateRef";
import {Alert, AlertRef} from "@marraph/daisy/components/alert/Alert";
import {useUser} from "@/context/UserContext";
import {Users} from "lucide-react";
import {Input} from "@marraph/daisy/components/input/Input";

export const JoinTeamDialog = forwardRef<DialogRef, DialogHTMLAttributes<HTMLDialogElement>>(({ className, ...props}, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const [link, setLink] = useState<string>("");
    const [valid, setValid] = useState<boolean>(false);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    const validate = () => {
        setValid(link.trim() !== "");
    }

    useEffect(() => {
        validate();
    }, [link]);

    if (!dialogRef || user === undefined) return null;

    const handleClose = () => {
        setValid(false);
        setLink("");
        setDialogKey(Date.now());
    }

    const joinTeam = () => {
        alertRef.current?.show();
        handleClose();
    }

    return (
        <>
            <Dialog width={600}
                    ref={dialogRef}
                    key={dialogKey}
            >
                <DialogHeader title={"Join a team"}
                              dialogRef={dialogRef}
                              onClose={handleClose}
                />
                <DialogContent>
                    <span className={"text-sm text-gray px-4"}>
                        {"You can join a team by inserting a invite link in the correct format."}
                    </span>
                    <Input placeholder={"app.luna.io/invite/xxxx-xxxx-xxxx"}
                           className={"w-full px-2 pb-2"}
                           value={link}
                           onChange={(e) => setLink(e.target.value)}
                    />
                </DialogContent>
                <DialogFooter saveButtonTitle={"Join"}
                              cancelButton={false}
                              switchButton={false}
                              dialogRef={dialogRef}
                              onClick={joinTeam}
                              disabledButton={!valid}
                />
            </Dialog>

            <Alert title={"Joined Team successfully!"}
                   icon={<Users color="#F55050"/>}
                   duration={3000}
                   ref={alertRef}
                   closeButton={false}
            />
        </>
    )
})
JoinTeamDialog.displayName = "JoinTeamDialog";