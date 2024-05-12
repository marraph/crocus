"use client";

import {Dialog, DialogContent} from "@marraph/daisy/components/dialog/Dialog";
import {Input} from "@marraph/daisy/components/input/Input";
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
            <Dialog className={cn("border border-white top-1/3 left-1/3 w-4/12", className)}  {...props}
                    open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogContent className={"flex flex-row justify-between space-x-4"}>
                    <div className={"flex flex-col flex-grow space-y-4"}>
                        <Input placeholder={"Title"} className={""}></Input>
                        <Textarea placeholder={"Description"} className={"h-20"}></Textarea>
                        <div className={"flex flex-row justify-end space-x-2"}>
                            <Combobox buttonTitle={"Team"} className={"h-8"}>
                                {team.map((team) => (
                                    <ComboboxItem key={team} title={""}>{team}</ComboboxItem>
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Project"} className={"h-8"}>
                                {project.map((project) => (
                                    <ComboboxItem title={""} key={project}>{project}</ComboboxItem>
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Topic"} className={"h-8"}>
                                {topic.map((topic) => (
                                    <ComboboxItem title={""} key={topic}>{topic}</ComboboxItem>
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Status"} className={"h-8"}>
                                {status.map((status) => (
                                    <ComboboxItem title={""} key={status}>{status}</ComboboxItem>
                                ))}
                            </Combobox>
                            <Button text={"Create"} theme={"white"} className={"w-min h-8"}></Button>
                        </div>
                    </div>
                    <CloseButton className={"h-min w-min"} text={""} onClick={() => setIsOpen(false)}></CloseButton>

                </DialogContent>
            </Dialog>
        </>
    )
}

