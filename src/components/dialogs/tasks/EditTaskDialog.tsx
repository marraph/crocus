"use client";

import React, {forwardRef, useEffect, useRef, useState} from "react";
import {BookCopy, CircleAlert, Hourglass, LineChart, Pencil, Save, Tag, Users} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";
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


type InitialValues = {
    title: string;
    description: string | null;
    team: string | null;
    project: string | null;
    topic: string | null;
    status: string | null;
    priority: string | null;
    deadline: Date | null;
    duration: string | null;
}

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    taskElement: TaskElement;
}

export const EditTaskDialog = forwardRef<DialogRef, DialogProps>(({ taskElement }, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);

    const status = ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"];
    const priorities = ["LOW", "MEDIUM", "HIGH"];
    const initialValues: InitialValues = {
        title: taskElement.name,
        description: taskElement.description ?? null,
        team: taskElement.team?.name ?? null,
        project: taskElement.project?.name ?? null,
        topic: taskElement.topic?.title ?? null,
        status: taskElement.status ?? null,
        priority: taskElement.priority ?? null,
        deadline: taskElement.deadline ?? null,
        duration: taskElement.duration?.toString() ?? null,
    }
    const [values, setValues] = useState(initialValues);
    const [teamSelected, setTeamSelected] = useState({isSelected: taskElement.team !== null, team: taskElement.team?.name ?? ""});
    const [valid, setValid] = useState(true);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const { data:user, isLoading:userLoading, error:userError } = useUser();

    useEffect(() => {
        validateInput();
    }, [values.title, values.duration]);

    if (!dialogRef) return null;
    if (!user) return null;

    const editTask = () => {
        const task: Task = {
            id: taskElement.id,
            name: values.title,
            description: values.description,
            topic: getTopicItem(user, values.topic as string) ?? null,
            status: values.status as Status ?? null,
            priority: values.priority as Priority ?? null,
            deadline: values.deadline ?? null,
            isArchived: false,
            duration: Number(values.duration) ?? null,
            bookedDuration: values.duration ? 0 : null,
            createdBy: taskElement.createdBy,
            createdDate: taskElement.createdDate,
            lastModifiedBy: { id: user.id, name: user.name, email: user.email },
            lastModifiedDate: new Date(),
        };
        const { data, isLoading, error } = updateTask(taskElement.id, task);
        alertRef.current?.show();
        handleCloseClick();

    };

    const handleCloseClick = () => {
        setDialogKey(Date.now());
        setValid(true);
        setValues(initialValues);
        setTeamSelected({isSelected: taskElement.team !== null, team: taskElement.team?.name ?? ""});
    };

    const validateInput = () => {
        if (values.title.trim() === "") {
            setValid(false);
            return;
        }

        setValid(true);
    }

    const handleNumberInput = (e: React.KeyboardEvent) => {
        if (!/\d/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    };

    return (
        <>
            <Dialog width={600} ref={dialogRef} key={dialogKey}>
                <DialogHeader title={"Edit Task"}
                              dialogRef={dialogRef}
                              onClose={handleCloseClick}
                />
                <DialogContent>
                    <div className={"flex flex-col space-y-4 p-4"}>
                        <div className={"flex flex-col space-y-1"}>
                            <span className={"text-gray text-xs"}>Title</span>
                            <Input placeholder={"Task Title"}
                                   value={values.title}
                                   onChange={(e) => values.title = e.target.value}
                            />
                        </div>
                        <div className={"flex flex-col space-y-1"}>
                            <span className={"text-gray text-xs"}>Description</span>
                            <Textarea placeholder={"Add Description..."}
                                      onChange={(e) => values.description = e.target.value}
                                      spellCheck={false}
                                      value={values.description ?? ""}
                                      className={"h-20 p-2 text-sm bg-dark placeholder-placeholder border-1 border-white border-opacity-20 focus:text-gray"}
                            />
                        </div>
                    </div>
                    <div className={"flex flex-row space-x-2 px-4"}>
                        <div className={"flex flex-col space-y-1 z-50"}>
                            <span className={"text-gray text-xs"}>Team</span>
                            <Combobox buttonTitle={"Team"}
                                      icon={<Users size={16} className={"mr-2"}/>}
                                      preSelectedValue={values.team}
                                      onValueChange={(value) => setTeamSelected({isSelected: value !== null, team: value ?? ""})}
                            >
                                {getTeams(user).map((team) => (
                                    <ComboboxItem key={team}
                                                  title={team}
                                    />
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-50"}>
                            {teamSelected && (
                                <>
                                    <span className={"text-gray text-xs"}>Project</span>
                                    <Combobox buttonTitle={"Project"}
                                              icon={<BookCopy size={16} className={"mr-2"}/>}
                                              preSelectedValue={values.project}
                                              onValueChange={(value) => values.project = value}
                                    >
                                        {getProjects(user, teamSelected.team).map((project) => (
                                            <ComboboxItem key={project} title={project}/>
                                        ))}
                                    </Combobox>
                                </>
                            )}
                        </div>
                        <div className={"flex flex-col space-y-1 z-50"}>
                            <span className={"text-gray text-xs"}>Deadline</span>
                            <DatePicker size={"medium"}
                                        iconSize={16}
                                        text={"Deadline"}
                                        preSelectedValue={values.deadline}
                                        onValueChange={(value) => values.deadline = value}
                                        closeButton={true}
                                        dayFormat={"short"}
                            />
                        </div>
                    </div>
                    <div className={"flex flex-row space-x-2 px-4 py-4"}>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Topic</span>
                            <Combobox buttonTitle={"Topic"}
                                      icon={<Tag size={16} className={"mr-2"}/>}
                                      preSelectedValue={values.topic}
                                      onValueChange={(value) => values.topic = value}
                            >
                                {getTopics(user).map((topic) => (
                                    <ComboboxItem key={topic} title={topic}/>
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Status</span>
                            <Combobox buttonTitle={"Status"}
                                      icon={<CircleAlert size={16} className={"mr-2"}/>}
                                      preSelectedValue={values.status}
                                      onValueChange={(value) => values.status = value}
                            >
                                {status.map((status) => (
                                    <ComboboxItem key={status} title={status}/>
                                ))}
                            </Combobox>
                        </div>
                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Priority</span>
                            <Combobox buttonTitle={"Priority"}
                                      icon={<LineChart size={16} className={"mr-2"}/>}
                                      preSelectedValue={values.priority}
                                      onValueChange={(value) => values.priority = value}
                            >
                                {priorities.map((priority) => (
                                    <ComboboxItem key={priority} title={priority}/>
                                ))}
                            </Combobox>
                        </div>

                        <div className={"flex flex-col space-y-1 z-40"}>
                            <span className={"text-gray text-xs"}>Duration</span>
                            <Input placeholder={"Duration in hours"}
                                   value={values.duration?.toString()}
                                   elementSize={"medium"}
                                   icon={<Hourglass size={16}/>}
                                   onChange={(e) => values.duration = e.target.value}
                                   onKeyDown={(e) => handleNumberInput(e)}
                            />
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

