"use client";

import React, {MutableRefObject, useEffect, useState} from "react";
import {Pencil, Save} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {Dialog} from "@marraph/daisy/components/dialog/Dialog";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {cn} from "@/utils/cn";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle} from "@marraph/daisy/components/alert/Alert";

const title = "Server api doesnt work"

const project = ["Project 1", "Project 2", "Project 3", "Project 4", "Project 5"];
const team = ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5"];
const topic = ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"];
const priority = ["None", "High", "Medium", "Low"];
const status = ["Open", "In Progress", "Done"];

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    buttonTrigger: boolean;
}

export const EditTaskDialog = React.forwardRef<HTMLDialogElement, DialogProps>(({ buttonTrigger, className, ...props}, ref) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const [showAlert, setShowAlert] = useState(false);

    const getDialogRef = (): MutableRefObject<HTMLDialogElement | null> => {
        if (ref && typeof ref === 'object') {
            return ref as MutableRefObject<HTMLDialogElement | null>;
        }
        return dialogRef;
    };

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => setShowAlert(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    const editTask = () => {
        getDialogRef().current?.close();
        setShowAlert(true);
    }

    return (
        <>
            {buttonTrigger &&
                <Button text={"Edit"} className={"h-8 mr-2"} onClick={() => getDialogRef().current?.showModal()}>
                    <Pencil size={16} className={"mr-2"}/>
                </Button>
            }

            <div className={"flex items-center justify-center"}>
                <Dialog
                    className={"border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible"} {...props}
                    ref={getDialogRef()}>
                    <div className={"flex flex-row justify-between px-4 pb-2"}>
                        <div className={"flex flex-col space-y-2"}>
                            <div className={"flex flex-row justify-between space-x-2 items-center pt-4"}>
                                <span className={"text-md text-white"}>Edit Task:</span>
                                <Badge text={title}
                                       className={"flex justify-end font-normal bg-dark text-white rounded-lg"}></Badge>
                            </div>
                        </div>
                        <CloseButton className={"h-min w-min mt-4"} onClick={() => getDialogRef().current?.close()}/>
                    </div>
                    <Seperator/>
                    <div className={"flex flex-row space-x-2 px-4 pt-4"}>
                        <div className={"flex flex-col space-y-1 z-50"}>
                            <span className={"text-gray text-xs"}>Team</span>
                            <Combobox buttonTitle={"Team"} preSelectedValue={team.at(0)}>
                                {team.map((team) => (
                                    <ComboboxItem key={team} title={team}/>
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-50"}>
                            <span className={"text-gray text-xs"}>Project</span>
                            <Combobox buttonTitle={"Project"} preSelectedValue={project.at(0)}>
                                {project.map((project) => (
                                    <ComboboxItem key={project} title={project}/>
                                ))}
                            </Combobox>
                        </div>
                    </div>
                    <div className={"flex flex-row space-x-2 px-4 py-4"}>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Topic</span>
                            <Combobox buttonTitle={"Topic"} preSelectedValue={topic.at(0)}>
                                {topic.map((topic) => (
                                    <ComboboxItem key={topic} title={topic}/>
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Status</span>
                            <Combobox buttonTitle={"Status"} preSelectedValue={status.at(0)}>
                                {status.map((status) => (
                                    <ComboboxItem key={status} title={status}/>
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Priority</span>
                            <Combobox buttonTitle={"Priority"} preSelectedValue={priority.at(0)}>
                                {priority.map((priority) => (
                                    <ComboboxItem key={priority} title={priority}/>
                                ))}
                            </Combobox>
                        </div>
                    </div>
                    <div className={"flex flex-row space-x-2 px-4 pb-4"}>
                        <div className={"flex flex-col space-y-1 z-30"}>
                            <span className={"text-gray text-xs"}>Due Date</span>
                            <DatePicker iconSize={16} text={"Due Date"}/>
                        </div>
                    </div>
                    <Seperator/>
                    <div className={cn("flex flex-row space-x-2 justify-end px-4 py-2")}>
                        <Button text={"Cancel"} className={cn("h-8")} onClick={() => getDialogRef().current?.close()}/>
                        <Button text={"Save changes"} theme={"white"} onClick={editTask} className={"h-8"}/>
                    </div>
                </Dialog>
            </div>

            {showAlert && (
                <Alert duration={3000} className={"fixed bottom-4 right-4 z-50 border border-white border-opacity-20 bg-dark"}>
                    <AlertIcon icon={<Save />}/>
                    <AlertContent>
                        <AlertTitle title={"Saved changes"}></AlertTitle>
                        <AlertDescription description={"You successfully saved your task changes."}></AlertDescription>
                    </AlertContent>
                </Alert>
            )}
        </>
    )
})
EditTaskDialog.displayName = "EditTaskDialog";

