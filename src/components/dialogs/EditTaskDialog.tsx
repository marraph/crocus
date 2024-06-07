"use client";

import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {Pencil, Save} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {Dialog} from "@marraph/daisy/components/dialog/Dialog";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {cn} from "@/utils/cn";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {Priority, Project, Status, Task, TaskElement, Team} from "@/types/types";
import {useUser} from "@/context/UserContext";

const title = "Server api doesnt work"

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    buttonTrigger: boolean;
    taskElement: TaskElement;
}

export const EditTaskDialog = React.forwardRef<HTMLDialogElement, DialogProps>(({ taskElement, buttonTrigger, className, ...props}, ref) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const teamRef = useRef<ComboboxRef>(null);
    const projectRef = useRef<ComboboxRef>(null);
    const topicRef = useRef<ComboboxRef>(null);
    const statusRef = useRef<ComboboxRef>(null);
    const priorityRef = useRef<ComboboxRef>(null);
    const datePickerRef = useRef<DatepickerRef>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [teamSelected, setTeamSelected] = useState("");
    const {data, isLoading, error} = useUser();

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

    if (!data) return null;

    const editTask = () => {
        const task: Task = {
            id: taskElement.id,
            //name: titleValue,
            //description: descriptionValue,
            topic: getTopicItem(topicRef.current?.getSelectedValue() as string) ?? null,
            status: statusRef.current?.getSelectedValue() as Status ?? null,
            priority: priorityRef.current?.getSelectedValue() as Priority ?? null,
            deadline: datePickerRef.current?.getSelectedValue() ?? null,
            isArchived: false,
            duration: null,
            createdBy: taskElement.createdBy,
            createdDate: taskElement.createdDate,
            lastModifiedBy: {id: data.id, name: data.name, email: data.email},
            lastModifiedDate: new Date(),
        }
        getDialogRef().current?.close();
        setShowAlert(true);
    }

    const getTeams = () => {
        const teams: string[] = [];
        data.teams.forEach((team: Team) => {
            teams.push(team.name);
        });
        return teams;
    }

    const getProjects = (teamToFind: string | null ) => {
        if (!teamToFind) return [];
        const specificTeam = data?.teams.find((team: Team) => team.name === teamToFind);
        const projects: string[] = [];
        specificTeam?.projects.forEach((project: Project) => {
            projects.push(project.name);
        });
        return projects;
    }

    const getTopics = () => {
        const topics: string[] = [];
        data?.teams.forEach(team => {
            team.projects.forEach(project => {
                project.tasks.forEach(task => {
                    if (task.topic) {
                        topics.push(task.topic.title);
                    }
                });
            });
        });
        return topics;
    }

    const getTopicItem = (topic: string) => {
        for (const team of data.teams ?? []) {
            for (const project of team.projects) {
                for (const task of project.tasks) {
                    if (task.topic?.title === topic) {
                        return task.topic;
                    }
                }
            }
        }
        return undefined;
    }

    const status = ["Pending", "Planing", "Started", "Tested", "Finished", "Archived"];

    const priorities = ["LOW", "MEDIUM", "HIGH"];

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
                            <Combobox buttonTitle={"Team"} preSelectedValue={teamRef.current?.getSelectedValue()}>
                                {getTeams().map((team) => (
                                    <ComboboxItem key={team} title={team} onClick={() => setTeamSelected(team)}/>
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-50"}>
                            <span className={"text-gray text-xs"}>Project</span>
                            {teamRef.current?.getSelectedValue() &&
                                <Combobox buttonTitle={"Project"} preSelectedValue={projectRef.current?.getSelectedValue()}>
                                    {getProjects(teamRef.current.getSelectedValue()).map((project) => (
                                        <ComboboxItem key={project} title={project}/>
                                    ))}
                                </Combobox>
                            }
                        </div>
                    </div>
                    <div className={"flex flex-row space-x-2 px-4 py-4"}>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Topic</span>
                            <Combobox buttonTitle={"Topic"} preSelectedValue={topicRef.current?.getSelectedValue()}>
                                {getTopics().map((topic) => (
                                    <ComboboxItem key={topic} title={topic}/>
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Status</span>
                            <Combobox buttonTitle={"Status"} preSelectedValue={statusRef.current?.getSelectedValue()}>
                                {status.map((status) => (
                                    <ComboboxItem key={status} title={status}/>
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Priority</span>
                            <Combobox buttonTitle={"Priority"} preSelectedValue={priorityRef.current?.getSelectedValue()}>
                                {priorities.map((priority) => (
                                    <ComboboxItem key={priority} title={priority}/>
                                ))}
                            </Combobox>
                        </div>
                    </div>
                    <div className={"flex flex-row space-x-2 px-4 pb-4"}>
                        <div className={"flex flex-col space-y-1 z-30"}>
                            <span className={"text-gray text-xs"}>Due Date</span>
                            <DatePicker iconSize={16} text={"Due Date"} preSelectedValue={datePickerRef.current?.getSelectedValue()}/>
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

