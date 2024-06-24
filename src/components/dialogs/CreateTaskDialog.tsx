"use client";

import {Dialog, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import React, {forwardRef, useEffect, useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {BookCopy, CircleAlert, Hourglass, LineChart, SquareCheckBig, SquarePen, Tag, Users} from "lucide-react";
import {cn} from "@/utils/cn";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {
    Alert,
    AlertContent,
    AlertDescription,
    AlertIcon,
    AlertRef,
    AlertTitle
} from "@marraph/daisy/components/alert/Alert";
import {createTask} from "@/service/hooks/taskHook";
import {PreviewUser, Priority, Project, Status, Task, Team} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {Input, InputRef} from "@marraph/daisy/components/input/Input";
import {Switch, SwitchRef} from "@marraph/daisy/components/switch/Switch";


export const CreateTaskDialog = forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(({className, ...props}, ref) => {
    const dialogRef = useRef<DialogRef>(null);
    const alertRef = useRef<AlertRef>(null);
    const teamRef = useRef<ComboboxRef>(null);
    const projectRef = useRef<ComboboxRef>(null);
    const topicRef = useRef<ComboboxRef>(null);
    const statusRef = useRef<ComboboxRef>(null);
    const priorityRef = useRef<ComboboxRef>(null);
    const datePickerRef = useRef<DatepickerRef>(null);
    const durationRef = useRef<InputRef>(null);
    const switchRef = useRef<SwitchRef>(null);
    const [titleValue, setTitleValue] = useState("");
    const [descriptionValue, setDescriptionValue] = useState("");
    const [durationValue, setDurationValue] = useState("");
    const [teamSelected, setTeamSelected] = useState({isSelected: false, team: ""});
    const [valid, setValid] = useState(false);
    const {data, isLoading, error} = useUser();

    useEffect(() => {
        validateInput();
    }, [titleValue, durationValue]);

    if (data === undefined) return null;

    const getTeams = () => {
        const teams: string[] = [];
        data?.teams.forEach((team: Team) => {
            teams.push(team.name);
        });
        return teams;
    }

    const getProjects = (teamToFind: string) => {
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
                    if (task.topic && !topics.includes(task.topic.title)) {
                        topics.push(task.topic.title);
                    }
                });
            });
        });
        return topics;
    }

    const getTopicItem = (topic: string) => {
        for (const team of data?.teams ?? []) {
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

    const status = ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"];

    const priorities = ["LOW", "MEDIUM", "HIGH"];


    const handleCreateClick = () => {
        const task: Task = {
            id: 0,
            name: titleValue,
            description: descriptionValue,
            topic: getTopicItem(topicRef.current?.getValue() as string) ?? null,
            status: statusRef.current?.getValue() as Status ?? null,
            priority: priorityRef.current?.getValue() as Priority ?? null,
            deadline: datePickerRef.current?.getSelectedValue() ?? null,
            isArchived: false,
            duration: Number(durationRef.current?.getValue()) ?? null,
            createdBy: {id: data.id, name: data.name, email: data.email},
            createdDate: new Date(),
            lastModifiedBy: {id: data.id, name: data.name, email: data.email},
            lastModifiedDate: new Date(),
        }
        //add to team & project
        const {data:Task, isLoading:taskLoading, error:taskError} = createTask(task);

        if (switchRef.current?.getValue() === false) {
            dialogRef.current?.close();
        }

        teamRef.current?.reset();
        projectRef.current?.reset();
        topicRef.current?.reset();
        statusRef.current?.reset();
        priorityRef.current?.reset();
        datePickerRef.current?.reset();
        durationRef.current?.reset();
        switchRef.current?.setValue(false);
        setTitleValue("");
        setDescriptionValue("");
        setDurationValue("");
        setValid(false);
        setTeamSelected({isSelected: false, team: ""})
        alertRef.current?.show();
    }

    const handleCloseClick = () => {
        dialogRef.current?.close();
        teamRef.current?.reset();
        projectRef.current?.reset();
        topicRef.current?.reset();
        statusRef.current?.reset();
        priorityRef.current?.reset();
        datePickerRef.current?.reset();
        durationRef.current?.reset();
        switchRef.current?.setValue(false);
        setTitleValue("");
        setDescriptionValue("");
        setDurationValue("");
        setValid(false);
        setTeamSelected({isSelected: false, team: ""})
    }

    const validateInput = () => {
        console.log(parseFloat(durationValue));

        if (durationValue.trim() !== "" && isNaN(parseFloat(durationValue))) {
            setValid(false);
            return;
        }

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
            <Button text={"Create Task"} theme={"white"} size={"small"} className={"w-min h-8"} onClick={() => dialogRef.current?.show()}>
                <SquarePen size={20} className={"mr-2"}/>
            </Button>

            <Dialog className={cn("border border-white border-opacity-20 left-1/3 w-1/3 drop-shadow-lg overflow-visible", className)} {...props} ref={dialogRef}>
                <div className={cn("flex flex-row justify-between space-x-4 px-4 pt-4 pb-2", className)}>
                    <div className={cn("flex flex-col flex-grow space-y-2", className)}>

                        <span className={cn("text-lg text-white", className)}>{"New Task"}</span>
                        <input placeholder={"Task Title"} id={"title"} value={titleValue} onChange={(e) => setTitleValue(e.target.value)}
                               className={cn("rounded-lg bg-black py-2 text-white placeholder-placeholder focus-visible:ring-0 border-0 focus-visible:outline-none", className)}/>
                        <Textarea placeholder={"Add Description..."} onChange={(e) => setDescriptionValue(e.target.value)} className={cn("h-20 bg-black placeholder-placeholder focus:text-gray", className)} value={descriptionValue} />

                        <div className={cn("flex flex-row space-x-2 z-50", className)}>
                            <Combobox buttonTitle={"Team"} size={"small"} icon={<Users size={12} className={"mr-1"}/>} ref={teamRef}>
                                {getTeams().map((team) => (
                                    <ComboboxItem title={team} key={team} size={"small"} onClick={() => setTeamSelected({isSelected: true, team: team})}/>
                                ))}
                            </Combobox>
                            {teamSelected.isSelected &&
                                <Combobox buttonTitle={"Project"} size={"small"} icon={<BookCopy size={12} className={"mr-1"}/>} ref={projectRef}>
                                    {getProjects(teamSelected.team).map((project) => (
                                        <ComboboxItem title={project} key={project} size={"small"}/>
                                    ))}
                                </Combobox>
                            }
                            <DatePicker text={"Deadline"} iconSize={12} size={"small"} ref={datePickerRef}/>
                        </div>

                        <div className={cn("flex flex-row space-x-2", className)}>
                            <Combobox buttonTitle={"Topic"} size={"small"} icon={<Tag size={12} className={"mr-1"}/>} ref={topicRef}>
                                {getTopics().map((topic) => (
                                    <ComboboxItem title={topic} key={topic} size={"small"}/>
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Status"} size={"small"} icon={<CircleAlert size={12} className={"mr-1"}/>} ref={statusRef}>
                                {status.map((status) => (
                                    <ComboboxItem title={status} key={status} size={"small"}/>
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Priority"} size={"small"} icon={<LineChart size={12} className={"mr-1"}/>} ref={priorityRef}>
                                {priorities.map((priority) => (
                                    <ComboboxItem title={priority} key={priority} size={"small"}/>
                                ))}
                            </Combobox>
                            <Input placeholder={"Duration in Hours"} elementSize={"small"} className={"w-28 placeholder-gray"} ref={durationRef}
                                   value={durationValue} icon={<Hourglass size={12}/>}
                                   onChange={(e) => setDurationValue(e.target.value)}
                                   onKeyDown={handleKeyDown}>
                            </Input>
                        </div>
                    </div>
                    <CloseButton className={cn("h-min w-min", className)} onClick={handleCloseClick}/>
                </div>
                <Seperator/>
                <div className={cn("flex flex-row justify-end items-center space-x-16 px-4 py-2", className)}>
                    <div className={"flex flex-row items-center space-x-2 text-gray text-xs"}>
                        <span>{"Create more"}</span>
                        <Switch ref={switchRef}></Switch>
                    </div>
                    <Button text={"Create"} theme={"white"} onClick={handleCreateClick} disabled={!valid}
                            className={cn("w-min h-8 disabled:cursor-not-allowed disabled:hover:none disabled:bg-dark disabled:text-gray", className)}>
                    </Button>
                </div>
            </Dialog>

            <Alert duration={3000} ref={alertRef}>
                <AlertIcon icon={<SquareCheckBig />}/>
                <AlertContent>
                    <AlertTitle title={"Task created successfully!"}></AlertTitle>
                    <AlertDescription description={"You can now work with the task in your task-overview."}></AlertDescription>
                </AlertContent>
            </Alert>
        </>
    )
})
CreateTaskDialog.displayName = "CreateTaskDialog";
