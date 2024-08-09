"use client";

import React, {DialogHTMLAttributes, forwardRef, useCallback, useEffect, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {mutateRef} from "@/utils/mutateRef";
import {useUser} from "@/context/UserContext";
import {Users} from "lucide-react";
import {Input} from "@marraph/daisy/components/input/Input";
import {useToast} from "griller/src/component/toaster";

export const JoinTeamDialog = forwardRef<DialogRef>(({}, ref) => {
    const dialogRef = mutateRef(ref);
    const [link, setLink] = useState<string>("");
    const [valid, setValid] = useState<boolean>(false);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const {addToast} = useToast();

    const validate = useCallback(() => {
        setValid(link.trim() !== "");
    }, [link]);

    useEffect(() => {
        validate();
    }, [link, validate]);

    const handleCloseClick = useCallback(() => {
        setValid(false);
        setLink("");
        setDialogKey(Date.now());
    }, []);

    const handleJoinClick = useCallback(() => {
        addToast({
            title: "Joined Team successfully!",
            icon: <Users/>,
            theme: "dark",
        });
        handleCloseClick();
    }, [addToast, handleCloseClick]);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={600}
                ref={dialogRef}
                key={dialogKey}
                onClose={handleCloseClick}
        >
            <DialogHeader title={"Join a team"}/>
            <DialogContent>
                <div className={"flex flex-col space-y-4 text-sm text-gray"}>
                    <span>
                        You can join a team by inserting a invite link in the correct format.
                    </span>
                    <Input placeholder={"app.luna.io/invite/xxxx-xxxx-xxxx"}
                           className={"w-full"}
                           value={link}
                           onChange={(e) => setLink(e.target.value)}
                    />
                </div>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Join"}
                          cancelButton={false}
                          onClick={handleJoinClick}
                          disabledButton={!valid}
            />
        </Dialog>
    )
})
JoinTeamDialog.displayName = "JoinTeamDialog";