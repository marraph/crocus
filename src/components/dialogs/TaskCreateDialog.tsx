"use client";

import {Dialog, DialogSeperator} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import React, {useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {SquarePen} from "lucide-react";
import {cn} from "@/utils/cn";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";

const team = ["None", "Frontend", "Backend"];
const project = ["None", "ServerAPI", "ClientAPI"];
const topic = ["None", "Bug", "Feature"];
const status = ["None", "Todo", "In Progress", "Done"];

export const TaskCreateDialog = React.forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(({className, ...props}) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const [titleValue, setTitleValue] = useState("");
    const [descriptionValue, setDescriptionValue] = useState("");

    const resetFields = () => {
        setTitleValue("");
        setDescriptionValue("");
    }

    const handleCreateClick = () => {
        handleCloseClick();
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleValue(e.target.value);
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescriptionValue(e.target.value);
    }

    const handleCloseClick = () => {
        dialogRef.current?.close();
        resetFields();
    }

    return (
        <>
            <Button text={"Create Task"} theme={"white"} size={"small"} className={"w-min h-8"} onClick={() => dialogRef.current?.showModal()}>
                <SquarePen size={20} className={"mr-3"}/>
            </Button>

            <Dialog className={cn("border border-white border-opacity-20 left-1/3 w-1/3 drop-shadow-2xl overflow-visible", className)} {...props} ref={dialogRef}>
                <div className={cn("flex flex-row justify-between space-x-4 px-4 pt-4 pb-2", className)}>
                    <div className={cn("flex flex-col flex-grow space-y-2", className)}>

                        <span className={cn("text-lg text-white", className)}>{"New Task"}</span>
                        <input placeholder={"Task Title"} id={"title"} value={titleValue} onChange={handleTitleChange}
                               className={cn("rounded-lg bg-black py-2 text-white placeholder-placeholder focus-visible:ring-0 border-0 focus-visible:outline-none", className)}/>
                        <Textarea placeholder={"Add Description..."} onChange={handleDescriptionChange} className={cn("h-20 bg-black placeholder-placeholder", className)} value={descriptionValue} />

                        <div className={cn("flex flex-row space-x-2", className)}>
                            <Combobox buttonTitle={"Team"} className={cn("h-8", className)}>
                                {team.map((team, index) => (
                                    <ComboboxItem title={team} key={index}/>
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Project"} className={cn("h-8", className)}>
                                {project.map((project) => (
                                    <ComboboxItem title={project} key={project}/>
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Topic"} className={cn("h-8", className)}>
                                {topic.map((topic) => (
                                    <ComboboxItem title={topic} key={topic}/>
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Status"} className={cn("h-8", className)}>
                                {status.map((status) => (
                                    <ComboboxItem title={status} key={status}/>
                                ))}
                            </Combobox>
                        </div>
                    </div>
                    <CloseButton className={cn("h-min w-min", className)} text={""} onClick={handleCloseClick} />
                </div>
                <DialogSeperator/>
                <div className={cn("flex flex-row justify-end px-4 py-2", className)}>
                    <Button text={"Create"} theme={"white"} onClick={handleCreateClick} disabled={titleValue.trim() === ""}
                            className={cn("w-min h-8 disabled:cursor-not-allowed disabled:hover:none disabled:bg-dark disabled:text-gray", className)}>
                    </Button>
                </div>
            </Dialog>
        </>
    )
})
TaskCreateDialog.displayName = "TaskCreateDialog";
