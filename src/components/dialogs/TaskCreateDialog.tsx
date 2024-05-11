"use client";

import {Dialog, DialogContent} from "@marraph/daisy/components/dialog/Dialog";
import {Input} from "@marraph/daisy/components/input/Input";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import React, {useState} from "react";
import {Button, ButtonIcon} from "@marraph/daisy/components/button/Button";
import {SquarePen} from "lucide-react";

export function TaskCreateDialog() {
    const [isOpen, setIsOpen] = useState(false)

    return(
        <>
            <Button text={"Create Task"} theme={"white"} className={"w-min h-8"} onClick={() => setIsOpen(true)}>
                <ButtonIcon icon={<SquarePen size={20}/>}/>
            </Button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogContent>
                    <div>
                        <Input placeholder={"Title"}></Input>
                        <Textarea placeholder={"Description"}></Textarea>
                    </div>
                </DialogContent>
            </Dialog>
        </>

    )
}

