"use client";

import {Dialog, DialogContent} from "@marraph/daisy/components/dialog/Dialog";
import {Input} from "@marraph/daisy/components/input/Input";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import React from "react";

export function TaskCreateDialog() {
    return(
        <Dialog>
            <DialogContent>
                <div>
                    <Input placeholder={"Title"}></Input>
                    <Textarea placeholder={"Description"}></Textarea>
                </div>
            </DialogContent>
        </Dialog>
    )
}

