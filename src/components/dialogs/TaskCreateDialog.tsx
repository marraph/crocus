"use client";

import {Dialog, DialogContent} from "@marraph/daisy/components/dialog/Dialog";
import {Input} from "@marraph/daisy/components/input/Input";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import React, {useState} from "react";
import {Button, ButtonIcon} from "@marraph/daisy/components/button/Button";
import {SquarePen} from "lucide-react";
import {cn} from "@/utils/cn";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";

export const TaskCreateDialog: React.FC<React.HTMLAttributes<HTMLDialogElement>> = ({className, ...props}) => {
    const [isOpen, setIsOpen] = useState(false)

    return(
        <>
            <Button text={"Create Task"} theme={"white"} className={"w-min h-8"} onClick={() => setIsOpen(true)}>
                <ButtonIcon icon={<SquarePen size={20}/>}/>
            </Button>
            <Dialog className={cn("border border-white top-1/3 left-1/3 w-4/12", className)}  {...props}
                    open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogContent className={"flex flex-row justify-between space-x-4"}>
                    <div className={"flex flex-col flex-grow space-y-4"}>
                        <Input placeholder={"Title"} className={""}></Input>
                        <Textarea placeholder={"Description"} className={"h-20"}></Textarea>
                        <div className={"flex flex-row justify-end"}>
                            <Button text={"Create"} theme={"white"} className={"w-min h-8"}></Button>
                        </div>
                    </div>
                    <CloseButton className={"h-min w-min"} text={""} onClick={() => setIsOpen(false)}></CloseButton>

                </DialogContent>
            </Dialog>
        </>
    )
}

