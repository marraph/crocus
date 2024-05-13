"use client";

import {Dialog, DialogContent, DialogSeperator} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import React, {useState} from "react";
import {Button, ButtonIcon} from "@marraph/daisy/components/button/Button";
import {SquarePen} from "lucide-react";
import {cn} from "@/utils/cn";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";

export const TaskCreateDialog: React.FC<React.HTMLAttributes<HTMLDialogElement>> = ({className, ...props}) => {
    const [isOpen, setIsOpen] = useState(false)

    const team = ["None", "Frontend", "Backend"];
    const project = ["None", "ServerAPI", "ClientAPI"];
    const topic = ["None", "Bug", "Feature"];
    const status = ["None", "Todo", "In Progress", "Done"];

    return(
        <>
            <Button text={"Create Task"} theme={"white"} className={"w-min h-8"} onClick={() => setIsOpen(true)}>
                <ButtonIcon icon={<SquarePen size={20}/>}/>
            </Button>
            <Dialog className={cn("border border-white border-opacity-20 top-1/3 left-1/3 w-4/12 drop-shadow-2xl", className)}  {...props}
                    open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogContent className={cn("flex flex-row justify-between space-x-4 px-4 pt-4 pb-2", className)}>
                    <div className={cn("flex flex-col flex-grow space-y-2", className)}>
                        <span className={cn("text-lg text-white", className)}>{"New Task"}</span>
                        <input placeholder={"Task Title"} className={cn("rounded-lg bg-black py-2 text-white placeholder-placeholder focus-visible:ring-0 border-0 focus-visible:outline-none", className)}/>
                        <Textarea placeholder={"Add Description..."} className={cn("h-20 bg-black placeholder-placeholder resize-none overflow-hidden", className)}></Textarea>
                        <div className={cn("flex flex-row space-x-2", className)}>
                            <Combobox buttonTitle={"Team"} className={cn("h-8", className)}>
                                {team.map((team) => (
                                    <ComboboxItem key={team} title={""}>{team}</ComboboxItem>
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Project"} className={cn("h-8", className)}>
                                {project.map((project) => (
                                    <ComboboxItem title={""} key={project}>{project}</ComboboxItem>
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Topic"} className={cn("h-8", className)}>
                                {topic.map((topic) => (
                                    <ComboboxItem title={""} key={topic}>{topic}</ComboboxItem>
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Status"} className={cn("h-8", className)}>
                                {status.map((status) => (
                                    <ComboboxItem title={""} key={status}>{status}</ComboboxItem>
                                ))}
                            </Combobox>
                        </div>
                    </div>
                    <CloseButton className={cn("h-min w-min", className)} text={""} onClick={() => setIsOpen(false)}></CloseButton>
                </DialogContent>
                <DialogSeperator/>
                <DialogContent className={cn("flex flex-row justify-end px-4 py-0.5", className)}>
                    <Button text={"Create"} theme={"white"} className={cn("w-min h-8", className)}></Button>
                </DialogContent>
            </Dialog>
        </>
    )
}

