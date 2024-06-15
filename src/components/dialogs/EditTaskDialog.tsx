"use client";

import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {BookCopy, CircleAlert, LineChart, Pencil, Save, Tag, Users} from "lucide-react";
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
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    buttonTrigger: boolean;
    taskElement: TaskElement;
}

export const EditTaskDialog = React.forwardRef<HTMLDialogElement, DialogProps>(({ taskElement, buttonTrigger, className, ...props}, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const teamRef = useRef<ComboboxRef>(null);
    const projectRef = useRef<ComboboxRef>(null);
    const topicRef = useRef<ComboboxRef>(null);
    const statusRef = useRef<ComboboxRef>(null);
    const priorityRef = useRef<ComboboxRef>(null);
    const datePickerRef = useRef<DatepickerRef>(null);
    const [titleValue, setTitleValue] = useState(taskElement.name);
    const [descriptionValue, setDescriptionValue] = useState(taskElement.description ?? undefined);
    const [showAlert, setShowAlert] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<string | null>(taskElement.team?.name ?? null);
    const { data, isLoading, error } = useUser();

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
            name: titleValue,
            description: descriptionValue ?? null,
            topic: getTopicItem(topicRef.current?.getSelectedValue() as string) ?? null,
            status: statusRef.current?.getSelectedValue() as Status ?? null,
            priority: priorityRef.current?.getSelectedValue() as Priority ?? null,
            deadline: datePickerRef.current?.getSelectedValue() ?? null,
            isArchived: false,
            duration: null,
            createdBy: taskElement.createdBy,
            createdDate: taskElement.createdDate,
            lastModifiedBy: { id: data.id, name: data.name, email: data.email },
            lastModifiedDate: new Date(),
        };
        getDialogRef().current?.close();
        setShowAlert(true);
    };

    const getTeams = () => {
        return data.teams.map((team: Team) => team.name);
    };

    const getProjects = (teamToFind: string | null) => {
        if (!teamToFind) return [];
        const specificTeam = data?.teams.find((team: Team) => team.name === teamToFind);
        return specificTeam ? specificTeam.projects.map((project: Project) => project.name) : [];
    };

    const getTopics = () => {
        const topics: string[] = [];
        data?.teams.forEach((team) => {
            team.projects.forEach((project) => {
                project.tasks.forEach((task) => {
                    if (task.topic && !topics.includes(task.topic.title)) {
                        topics.push(task.topic.title);
                    }
                });
            });
        });
        return topics;
    };

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
    };

    const status = ["Pending", "Planning", "Started", "Tested", "Finished"];
    const priorities = ["LOW", "MEDIUM", "HIGH"];

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleValue(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescriptionValue(e.target.value);
    };

    const handleCloseClick = () => {
        getDialogRef().current?.close();
        teamRef.current?.setValue(taskElement.team?.name);
        projectRef.current?.setValue(taskElement.project?.name);
        topicRef.current?.setValue(taskElement.topic?.title);
        statusRef.current?.setValue(taskElement.status);
        priorityRef.current?.setValue(taskElement.priority);
        datePickerRef.current?.setValue(taskElement.deadline);
        setTitleValue(taskElement.name);
        setDescriptionValue(taskElement.description ?? "");
        setSelectedTeam(taskElement.team?.name ?? null);
    };

    const handleTeamChange = (team: string) => {

        if (team === selectedTeam){
            setSelectedTeam(null);
            teamRef.current?.setValue(null);
        } else {
            setSelectedTeam(team);
            teamRef.current?.setValue(team);
        }
    };

    return (
        <>
            {buttonTrigger && (
                <Button text={"Edit"} className={"h-8 mr-2"} onClick={() => getDialogRef().current?.showModal()}>
                    <Pencil size={16} className={"mr-2"} />
                </Button>
            )}

            <div className={"flex items-center justify-center"}>
                <Dialog className={"border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible"} {...props} ref={getDialogRef()}>
                    <div className={"flex flex-row justify-between px-4 pb-2"}>
                        <div className={"flex flex-col space-y-2"}>
                            <div className={"flex flex-row justify-between space-x-2 items-center pt-4"}>
                                <span className={"text-md text-white"}>Edit Task:</span>
                                <Badge text={taskElement.id.toString()} className={"flex justify-end font-normal bg-dark text-white rounded-lg"}></Badge>
                            </div>
                        </div>
                        <CloseButton className={"h-min w-min mt-4"} onClick={() => handleCloseClick()} />
                    </div>
                    <Seperator />
                    <div className={"flex flex-col space-y-4 p-4"}>
                        <div className={"flex flex-col space-y-1"}>
                            <span className={"text-gray text-xs"}>Title</span>
                            <input
                                placeholder={"Task Title"}
                                id={"title"}
                                value={titleValue}
                                onChange={handleTitleChange}
                                className={cn(
                                    "mb-2 text-sm rounded-lg bg-black py-2 px-2 border border-white border-opacity-20 text-white placeholder-placeholder focus-visible:ring-0 focus-visible:outline-none",
                                    className
                                )}
                            />
                        </div>
                        <div className={"flex flex-col space-y-1"}>
                            <span className={"text-gray text-xs"}>Description</span>
                            <Textarea
                                placeholder={"Add Description..."}
                                onChange={handleDescriptionChange}
                                spellCheck={false}
                                className={"h-20 p-2 text-sm bg-dark placeholder-placeholder border-1 border-white border-opacity-20"}
                                value={descriptionValue}
                            />
                        </div>
                    </div>

                    <div className={"flex flex-row space-x-2 px-4"}>
                        <div className={"flex flex-col space-y-1 z-50"}>
                            <span className={"text-gray text-xs"}>Team</span>
                            <Combobox buttonTitle={"Team"} icon={<Users size={16} className={"mr-2"}/>} ref={teamRef}
                                      preSelectedValue={taskElement.team?.name} onChange={() => handleTeamChange}>
                                {getTeams().map((team) => (
                                    <ComboboxItem key={team} title={team} onClick={() => handleTeamChange(team)}/>
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-50"}>
                            {selectedTeam && (
                                <>
                                    <span className={"text-gray text-xs"}>Project</span>
                                    <Combobox buttonTitle={"Project"} icon={<BookCopy size={16} className={"mr-2"}/>}
                                              ref={projectRef}
                                              preSelectedValue={taskElement.project?.name}>
                                        {getProjects(selectedTeam).map((project) => (
                                            <ComboboxItem key={project} title={project}/>
                                        ))}
                                    </Combobox>
                                </>
                            )}
                        </div>
                        <div className={"flex flex-col space-y-1 z-30"}>
                            <span className={"text-gray text-xs"}>Deadline</span>
                            <DatePicker size={"medium"} iconSize={16} text={"Deadline"} ref={datePickerRef}
                                        preSelectedValue={taskElement.deadline}/>
                        </div>
                    </div>
                    <div className={"flex flex-row space-x-2 px-4 py-4"}>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Topic</span>
                            <Combobox buttonTitle={"Topic"} icon={<Tag size={16} className={"mr-2"}/>} ref={topicRef}
                                      preSelectedValue={taskElement.topic?.title}>
                                {getTopics().map((topic) => (
                                    <ComboboxItem key={topic} title={topic} />
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Status</span>
                            <Combobox buttonTitle={"Status"} icon={<CircleAlert size={16} className={"mr-2"}/>} ref={statusRef}
                                      preSelectedValue={taskElement.status}>
                                {status.map((status) => (
                                    <ComboboxItem key={status} title={status} />
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Priority</span>
                            <Combobox buttonTitle={"Priority"} icon={<LineChart size={16} className={"mr-2"}/>} ref={priorityRef}
                                      preSelectedValue={taskElement.priority}>
                                {priorities.map((priority) => (
                                    <ComboboxItem key={priority} title={priority} />
                                ))}
                            </Combobox>
                        </div>
                    </div>
                    <Seperator />
                    <div className={cn("flex flex-row space-x-2 justify-end px-4 py-2")}>
                        <Button text={"Cancel"} className={cn("h-8")} onClick={() => handleCloseClick()} />
                        <Button text={"Save changes"} theme={"white"} onClick={editTask} className={"h-8"} />
                    </div>
                </Dialog>
            </div>

            {showAlert && (
                <Alert duration={3000} className={"fixed bottom-4 right-4 z-50 border border-white border-opacity-20 bg-dark"}>
                    <AlertIcon icon={<Save />} />
                    <AlertContent>
                        <AlertTitle title={"Saved changes"}></AlertTitle>
                        <AlertDescription description={"You successfully saved your task changes."}></AlertDescription>
                    </AlertContent>
                </Alert>
            )}
        </>
    );
});
EditTaskDialog.displayName = "EditTaskDialog";

