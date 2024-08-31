"use client";

import React, {DialogHTMLAttributes, forwardRef, useCallback, useEffect, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {mutateRef} from "@/utils/mutateRef";
import {useUser} from "@/context/UserContext";
import {Users} from "lucide-react";
import {Input} from "@marraph/daisy/components/input/Input";
import {useToast} from "griller/src/component/toaster";

export const LogOutDialog = forwardRef<DialogRef>(({}, ref) => {
    const dialogRef = mutateRef(ref);
    const { user } = useUser();

    const handleLogOutClick = useCallback(() => {
        dialogRef?.current?.close();
    }, [dialogRef]);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={600}
                onSubmit={handleLogOutClick}
                ref={dialogRef}
        >
            <DialogHeader title={"Log out"}/>
            <DialogContent>
                <div className={"flex flex-col space-y-4 text-sm text-zinc-500 dark:text-gray"}>
                    <span>
                       Are u sure you want to log out?
                    </span>
                </div>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Log out"}
                          cancelButton={true}
                          cancelButtonTitle={"Stay here"}
            />
        </Dialog>
    )
})
LogOutDialog.displayName = "LogOutDialog";