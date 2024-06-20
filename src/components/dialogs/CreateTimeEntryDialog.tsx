import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {cn} from "@/utils/cn";
import {Dialog} from "@marraph/daisy/components/dialog/Dialog";
import {Alert, AlertContent, AlertIcon, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {AlarmClockPlus} from "lucide-react";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {Input} from "@marraph/daisy/components/input/Input";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";
import { useUser } from "@/context/UserContext";
import {Project, Task, Team} from "@/types/types";

export const CreateTimeEntryDialog = React.forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(({ className, ...props}, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const taskRef = useRef<ComboboxRef>(null);
    const projectRef = useRef<ComboboxRef>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [projectSelected, setProjectSelected] = useState<string | null>(null);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

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

    const getProjects = () => {
        const projects: string[] = [];
        user?.teams.forEach((team: Team) => {
            team.projects.forEach((project: Project) => {
                projects.push(project.name);
            });
        });
        return projects;
    }

    const getAllTasks = () => {
        const tasks: string[] = [];
        user?.teams.forEach((team: Team) => {
            team.projects.forEach((project: Project) => {
                project.tasks.forEach((task: Task) => {
                    tasks.push(task.name);
                });
            });
        });
        return tasks;
    }

    const getTasks = (projectToFind: string) => {
        const tasks: string[] = [];
        user?.teams.forEach((team: Team) => {
            team.projects.forEach((project: Project) => {
                if (project.name === projectToFind) {
                    project.tasks.forEach((task: Task) => {
                        tasks.push(task.name);
                    });
                }
            });
        });
        return tasks;
    }

    const createTimeEntry = () => {
        getDialogRef().current?.close();
        setShowAlert(true);
    }

    const handleCloseClick = () => {
        getDialogRef().current?.close();
        taskRef.current?.reset();
        projectRef.current?.reset();
        setProjectSelected(null);
    }

    return (
        <>
            <Button text={"New Entry"} theme={"white"} className={"w-min h-8"} onClick={() => getDialogRef().current?.showModal()}>
                <AlarmClockPlus size={20} className={"mr-2"}/>
            </Button>

            <div className={cn("flex items-center justify-center")}>
                <Dialog className={cn("border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible space-y-2")} {...props} ref={getDialogRef()}>
                    <div className={cn("flex flex-row justify-between space-x-4 pt-4 pb-2 px-4", className)}>
                        <span className={"justify-start text-white text-lg"}>{"Create a new entry"}</span>
                        <CloseButton className={cn("h-min w-min", className)} onClick={handleCloseClick}/>
                    </div>

                    <Input placeholder={"Comment"} border={"none"}></Input>

                    <Combobox buttonTitle={"Project"} ref={projectRef}>
                        {getProjects().map((project) => (
                            <ComboboxItem key={project} title={project} onClick={() => setProjectSelected(project)}></ComboboxItem>
                        ))}
                    </Combobox>

                    <Combobox buttonTitle={"Task"} ref={taskRef}>
                        {!projectSelected && getAllTasks().map((task) => (
                            <ComboboxItem key={task} title={task}></ComboboxItem>
                        ))}
                        {projectSelected && getTasks(projectSelected).map((task) => (
                            <ComboboxItem key={task} title={task}></ComboboxItem>
                        ))}
                    </Combobox>

                    <Seperator/>
                    <div className={cn("flex flex-row justify-end px-4 py-2", className)}>
                        <Button text={"Create"} theme={"white"} onClick={createTimeEntry} //disabled={titleValue.trim() === ""}
                                className={cn("w-min h-8 disabled:cursor-not-allowed disabled:hover:none disabled:bg-dark disabled:text-gray", className)}>
                        </Button>
                    </div>
                </Dialog>
            </div>

            {showAlert && (
                <Alert duration={3000}
                       className={"fixed bottom-4 right-4 z-50 border border-white border-opacity-20 bg-dark"}>
                    <AlertIcon icon={<AlarmClockPlus/>}/>
                    <AlertContent>
                        <AlertTitle title={"Time Entry created successfully!"}></AlertTitle>
                    </AlertContent>
                </Alert>
            )}
        </>
    );
})
CreateTimeEntryDialog.displayName = "CreateTimeEntryDialog";