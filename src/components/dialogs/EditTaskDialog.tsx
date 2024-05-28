"use client";

import React, {useState} from "react";
import {Pencil} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {Dialog, DialogSeperator} from "@marraph/daisy/components/dialog/Dialog";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {cn} from "@/utils/cn";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {SavedTaskChangesAlert} from "@/components/alerts/SavedTaskChangesAlert";

const title = "Server api doesnt work"

const project = ["Project 1", "Project 2", "Project 3", "Project 4", "Project 5"];
const team = ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5"];
const topic = ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"];
const priority = ["None", "High", "Medium", "Low"];
const status = ["Open", "In Progress", "Done"];

export const EditTaskDialog = React.forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(({className, ...props}) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const [showAlert, setShowAlert] = useState(false);

    const handleAlert = () => {
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const editTask = () => {
        dialogRef.current?.close();
        handleAlert();
    }

    return (
        <>
            <Button text={"Edit"} className={"h-8 mr-2"} onClick={() => dialogRef.current?.showModal()}>
                <Pencil size={16} className={"mr-2"}/>
            </Button>

            <div className={"flex items-center justify-center"}>
                <Dialog
                    className={"border border-white border-opacity-20 w-1/3 drop-shadow-2xl overflow-visible"} {...props}
                    ref={dialogRef}>
                    <div className={"flex flex-row justify-between px-4 pb-2"}>
                        <div className={"flex flex-col space-y-2"}>
                            <div className={"flex flex-row justify-between space-x-2 items-center pt-4"}>
                                <span className={"text-md text-white"}>Edit Task:</span>
                                <Badge text={title}
                                       className={"flex justify-end font-normal bg-dark text-white rounded-lg"}></Badge>
                            </div>
                        </div>
                        <CloseButton className={"h-min w-min mt-4"} onClick={() => dialogRef.current?.close()}/>
                    </div>
                    <DialogSeperator/>
                    <div className={"flex flex-row space-x-2 px-4 py-2"}>
                        <Combobox buttonTitle={"Team"}>
                            {team.map((team) => (
                                <ComboboxItem key={team} title={team}/>
                            ))}
                        </Combobox>
                        <Combobox buttonTitle={"Project"}>
                            {project.map((project) => (
                                <ComboboxItem key={project} title={project}/>
                            ))}
                        </Combobox>
                    </div>
                    <div className={"flex flex-row space-x-2 px-4 py-2"}>
                        <Combobox buttonTitle={"Topic"}>
                            {topic.map((topic) => (
                                <ComboboxItem key={topic} title={topic}/>
                            ))}
                        </Combobox>
                        <Combobox buttonTitle={"Status"}>
                            {status.map((status) => (
                                <ComboboxItem key={status} title={status}/>
                            ))}
                        </Combobox>
                        <Combobox buttonTitle={"Priority"}>
                            {priority.map((priority) => (
                                <ComboboxItem key={priority} title={priority}/>
                            ))}
                        </Combobox>
                    </div>
                        <DialogSeperator/>
                        <div className={cn("flex flex-row space-x-2 justify-end px-4 py-2")}>
                            <Button text={"Cancel"} className={cn("h-8")}
                                    onClick={() => dialogRef.current?.close()}/>
                            <Button text={"Save changes"} theme={"white"} onClick={editTask}
                                    className={"h-8"}/>
                        </div>
                </Dialog>
            </div>

            {showAlert && (
                <SavedTaskChangesAlert/>
            )}
        </>
)
})
EditTaskDialog.displayName = "EditTaskDialog";

