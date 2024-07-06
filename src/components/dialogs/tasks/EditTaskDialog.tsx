"use client";

import React, {forwardRef, useEffect, useRef, useState} from "react";
import {BookCopy, CircleAlert, Hourglass, LineChart, Pencil, Save, Tag, Users} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {cn} from "@/utils/cn";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {
    Alert,
    AlertContent,
    AlertDescription,
    AlertIcon,
    AlertRef,
    AlertTitle
} from "@marraph/daisy/components/alert/Alert";
import {Priority, Project, Status, Task, TaskElement, Team} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {Textarea, TextareaRef} from "@marraph/daisy/components/textarea/Textarea";
import {Input, InputRef} from "@marraph/daisy/components/input/Input";
import {mutateRef} from "@/utils/mutateRef";
import {getProjects, getTeams, getTopicItem, getTopics} from "@/utils/getTypes";
import {updateTask} from "@/service/hooks/taskHook";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    taskElement: TaskElement;
}

export const EditTaskDialog = forwardRef<DialogRef, DialogProps>(({ taskElement }, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const titleRef = useRef<InputRef>(null);
    const descriptionRef = useRef<TextareaRef>(null);
    const teamRef = useRef<ComboboxRef>(null);
    const projectRef = useRef<ComboboxRef>(null);
    const topicRef = useRef<ComboboxRef>(null);
    const statusRef = useRef<ComboboxRef>(null);
    const priorityRef = useRef<ComboboxRef>(null);
    const datePickerRef = useRef<DatepickerRef>(null);
    const durationRef = useRef<InputRef>(null);
    const [titleValue, setTitleValue] = useState(taskElement.name);
    const [descriptionValue, setDescriptionValue] = useState(taskElement.description ?? "");
    const [durationValue, setDurationValue] = useState(taskElement.duration?.toString() ?? "");
    const [selectedTeam, setSelectedTeam] = useState<string | null>(taskElement.team?.name ?? "");
    const [valid, setValid] = useState(true);
    const { data:user, isLoading:userLoading, error:userError } = useUser();

    useEffect(() => {
        if (user && dialogRef && titleRef.current && descriptionRef.current && teamRef.current && projectRef.current && topicRef.current && statusRef.current && priorityRef.current && datePickerRef.current && durationRef.current) {
            validateInput();
        }
    }, [titleValue]);

    if (!dialogRef) return null;
    if (!user) return null;

    const editTask = () => {
        const task: Task = {
            id: taskElement.id,
            name: titleValue,
            description: descriptionValue ?? null,
            topic: getTopicItem(user, topicRef.current?.getValue() as string) ?? null,
            status: statusRef.current?.getValue() as Status ?? null,
            priority: priorityRef.current?.getValue() as Priority ?? null,
            deadline: datePickerRef.current?.getSelectedValue() ?? null,
            isArchived: false,
            duration: parseFloat(durationValue) ?? null,
            bookedDuration: taskElement.bookedDuration,
            createdBy: taskElement.createdBy,
            createdDate: taskElement.createdDate,
            lastModifiedBy: { id: user.id, name: user.name, email: user.email },
            lastModifiedDate: new Date(),
        };
        const { data, isLoading, error } = updateTask(taskElement.id, task);
        alertRef.current?.show();
    };

    const status = ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"];
    const priorities = ["LOW", "MEDIUM", "HIGH"];

    const handleCloseClick = () => {
        teamRef.current?.setValue(taskElement.team?.name);
        projectRef.current?.setValue(taskElement.project?.name);
        topicRef.current?.setValue(taskElement.topic?.title);
        statusRef.current?.setValue(taskElement.status);
        priorityRef.current?.setValue(taskElement.priority);
        datePickerRef.current?.setValue(taskElement.deadline);
        durationRef.current?.setValue(taskElement.duration?.toString());
        titleRef.current?.setValue(taskElement.name);
        descriptionRef.current?.setValue(taskElement.description ?? "");
        durationRef.current?.setValue(taskElement.duration ?? "");
        setTitleValue(taskElement.name);
        setDescriptionValue(taskElement.description ?? "");
        setDurationValue(taskElement.duration?.toString() ?? "");
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

    const validateInput = () => {
        if (titleValue.trim() === "") {
            setValid(false);
            return;
        }

        setValid(true);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (
            (e.key >= '0' && e.key <= '9') ||
            e.key === '.' ||
            e.key === 'Backspace' ||
            e.key === 'Delete' ||
            e.key === 'Tab' ||
            e.key === 'Escape' ||
            e.key === 'Enter' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === 'Home' ||
            e.key === 'End'
        ) {
            return;
        } else {
            e.preventDefault();
        }
    };

    return (
        <>
            <Dialog width={600} ref={dialogRef}>
                <DialogHeader title={"Edit Task"}
                              dialogRef={dialogRef}
                />
                <DialogContent>
                    <div className={"flex flex-col space-y-4 p-4"}>
                        <div className={"flex flex-col space-y-1"}>
                            <span className={"text-gray text-xs"}>Title</span>
                            <Input
                                placeholder={"Task Title"}
                                ref={titleRef}
                                value={titleValue}
                                onChange={(e) => setTitleValue(e.target.value)}
                            />
                        </div>
                        <div className={"flex flex-col space-y-1"}>
                            <span className={"text-gray text-xs"}>Description</span>
                            <Textarea
                                placeholder={"Add Description..."}
                                ref={descriptionRef}
                                onChange={(e) => setDescriptionValue(e.target.value)}
                                spellCheck={false}
                                className={"h-20 p-2 text-sm bg-dark placeholder-placeholder border-1 border-white border-opacity-20 focus:text-gray"}
                                value={descriptionValue}
                            />
                        </div>
                    </div>

                    <div className={"flex flex-row space-x-2 px-4"}>
                        <div className={"flex flex-col space-y-1 z-50"}>
                            <span className={"text-gray text-xs"}>Team</span>
                            <Combobox buttonTitle={"Team"} icon={<Users size={16} className={"mr-2"}/>} ref={teamRef}
                                      preSelectedValue={taskElement.team?.name} onChange={() => handleTeamChange}>
                                {getTeams(user).map((team) => (
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
                                        {getProjects(user, selectedTeam).map((project) => (
                                            <ComboboxItem key={project} title={project}/>
                                        ))}
                                    </Combobox>
                                </>
                            )}
                        </div>
                        <div className={"flex flex-col space-y-1 z-50"}>
                            <span className={"text-gray text-xs"}>Deadline</span>
                            <DatePicker size={"medium"} iconSize={16} text={"Deadline"} ref={datePickerRef}
                                        preSelectedValue={taskElement.deadline} closeButton={true} dayFormat={"short"}/>
                        </div>
                    </div>
                    <div className={"flex flex-row space-x-2 px-4 py-4"}>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Topic</span>
                            <Combobox buttonTitle={"Topic"} icon={<Tag size={16} className={"mr-2"}/>} ref={topicRef}
                                      preSelectedValue={taskElement.topic?.title}>
                                {getTopics(user).map((topic) => (
                                    <ComboboxItem key={topic} title={topic}/>
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Status</span>
                            <Combobox buttonTitle={"Status"} icon={<CircleAlert size={16} className={"mr-2"}/>}
                                      ref={statusRef}
                                      preSelectedValue={taskElement.status}>
                                {status.map((status) => (
                                    <ComboboxItem key={status} title={status}/>
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Priority</span>
                            <Combobox buttonTitle={"Priority"} icon={<LineChart size={16} className={"mr-2"}/>}
                                      ref={priorityRef}
                                      preSelectedValue={taskElement.priority}>
                                {priorities.map((priority) => (
                                    <ComboboxItem key={priority} title={priority}/>
                                ))}
                            </Combobox>
                        </div>

                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Duration</span>
                            <Input placeholder={"Duration in hours"}
                                   value={durationValue}
                                   elementSize={"medium"}
                                   ref={durationRef}
                                   icon={<Hourglass size={16}/>}
                                   onChange={(e) => setDurationValue(e.target.value)}
                                   onKeyDown={handleKeyDown}>
                            </Input>
                        </div>
                    </div>
                </DialogContent>
                <DialogFooter saveButtonTitle={"Save changes"}
                              cancelButton={true}
                              switchButton={false}
                              dialogRef={dialogRef}
                              onClick={editTask}
                              onClose={handleCloseClick}
                />
            </Dialog>

            <Alert duration={3000} ref={alertRef} closeButton={false}>
                <AlertIcon icon={<Save/>}/>
                <AlertContent>
                    <AlertTitle title={"Saved changes"}></AlertTitle>
                    <AlertDescription description={"You successfully saved your task changes."}></AlertDescription>
                </AlertContent>
            </Alert>
        </>
);
});
EditTaskDialog.displayName = "EditTaskDialog";

