"use client";

import {Dialog} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import React, {useEffect, useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {SquareCheckBig, SquarePen} from "lucide-react";
import {cn} from "@/utils/cn";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {createTask} from "@/service/hooks/taskHook";
import {PreviewUser, Task, User} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {findTaskProps} from "@/utils/findTaskProps";

const project = ["None", "ServerAPI", "ClientAPI"];
const topic = ["None", "Bug", "Feature"];
const status = ["None", "Todo", "In Progress", "Done"];
const priority = ["None", "Low", "Medium", "High"];


export const CreateTaskDialog = React.forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(({className, ...props}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const teamRef = useRef<ComboboxRef>(null);
    const projectRef = useRef<ComboboxRef>(null);
    const topicRef = useRef<ComboboxRef>(null);
    const statusRef = useRef<ComboboxRef>(null);
    const priorityRef = useRef<ComboboxRef>(null);
    const datePickerRef = useRef<DatepickerRef>(null);

    const [titleValue, setTitleValue] = useState("");
    const [descriptionValue, setDescriptionValue] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const [teamSelected, setTeamSelected] = useState(false);

    const {data, isLoading, error} = useUser();
    const {task, team, project} = findTaskProps(data, 1);


    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => setShowAlert(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    if (data === undefined) return null;


    const handleCreateClick = () => {
        handleCloseClick();
        const user: PreviewUser = {
            id: data.id,
            name: data.name,
            email: data.email,
        }
        const task: Task = {
            name: titleValue,
            description: descriptionValue,
            //topic:,
            //status:,
            //priority:,
            deadline: datePickerRef.current?.getSelectedValue() ?? null,
            isArchived: false,
            duration: null,
            createdBy: user,
            createdDate: new Date(),
            lastModifiedBy: user,
            lastModifiedDate: new Date(),
        }
        //add to team & project
        const {data:Task, isLoading:taskLoading, error:taskError} = createTask(task);
        setShowAlert(true);
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleValue(e.target.value);
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescriptionValue(e.target.value);
    }

    const handleCloseClick = () => {
        dialogRef.current?.close();
        teamRef.current?.reset();
        projectRef.current?.reset();
        topicRef.current?.reset();
        statusRef.current?.reset();
        priorityRef.current?.reset();
        datePickerRef.current?.reset();
        setTitleValue("");
        setDescriptionValue("");
    }

    return (
        <>
            <Button text={"Create Task"} theme={"white"} size={"small"} className={"w-min h-8"} onClick={() => dialogRef.current?.showModal()}>
                <SquarePen size={20} className={"mr-2"}/>
            </Button>

            <Dialog className={cn("border border-white border-opacity-20 left-1/3 w-1/3 drop-shadow-lg overflow-visible", className)} {...props} ref={dialogRef}>
                <div className={cn("flex flex-row justify-between space-x-4 px-4 pt-4 pb-2", className)}>
                    <div className={cn("flex flex-col flex-grow space-y-2", className)}>

                        <span className={cn("text-lg text-white", className)}>{"New Task"}</span>
                        <input placeholder={"Task Title"} id={"title"} value={titleValue} onChange={handleTitleChange}
                               className={cn("rounded-lg bg-black py-2 text-white placeholder-placeholder focus-visible:ring-0 border-0 focus-visible:outline-none", className)}/>
                        <Textarea placeholder={"Add Description..."} onChange={handleDescriptionChange} className={cn("h-20 bg-black placeholder-placeholder", className)} value={descriptionValue} />

                        <div className={cn("flex flex-row space-x-2", className)}>
                            <Combobox buttonTitle={"Team"} size={"small"} ref={teamRef}>
                                {data.teams.map((team) => (
                                    <ComboboxItem title={team.name} key={team.name} size={"small"} onClick={() => setTeamSelected(true)}/>
                                ))}
                            </Combobox>
                            {teamSelected &&
                                <Combobox buttonTitle={"Project"} size={"small"} ref={projectRef}>
                                    {data.teams.map((project) => (
                                        <ComboboxItem title={project.name} key={project} size={"small"}/>
                                    ))}
                                </Combobox>
                            }
                            <Combobox buttonTitle={"Topic"} size={"small"} ref={topicRef}>
                                {topic.map((topic) => (
                                    <ComboboxItem title={topic} key={topic} size={"small"}/>
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Status"} size={"small"} ref={statusRef}>
                                {status.map((status) => (
                                    <ComboboxItem title={status} key={status} size={"small"}/>
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Priority"} size={"small"} ref={priorityRef}>
                                {priority.map((priority) => (
                                    <ComboboxItem title={priority} key={priority} size={"small"}/>
                                ))}
                            </Combobox>
                            <DatePicker text={"Due Date"} iconSize={12} size={"small"} className={"h-8"} ref={datePickerRef}/>
                        </div>
                    </div>
                    <CloseButton className={cn("h-min w-min", className)} onClick={handleCloseClick} />
                </div>
                <Seperator/>
                <div className={cn("flex flex-row justify-end px-4 py-2", className)}>
                    <Button text={"Create"} theme={"white"} onClick={handleCreateClick} disabled={titleValue.trim() === ""}
                            className={cn("w-min h-8 disabled:cursor-not-allowed disabled:hover:none disabled:bg-dark disabled:text-gray", className)}>
                    </Button>
                </div>
            </Dialog>

            {showAlert && (
                <Alert duration={3000} className={"fixed bottom-4 right-4 z-50 border border-white border-opacity-20 bg-dark"}>
                    <AlertIcon icon={<SquareCheckBig />}/>
                    <AlertContent>
                        <AlertTitle title={"Task created successfully!"}></AlertTitle>
                        <AlertDescription description={"You can now work with the task in your task-overview."}></AlertDescription>
                    </AlertContent>
                </Alert>
            )}
        </>
    )
})
CreateTaskDialog.displayName = "CreateTaskDialog";
