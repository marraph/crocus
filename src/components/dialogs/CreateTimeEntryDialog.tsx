import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {cn} from "@/utils/cn";
import {Dialog} from "@marraph/daisy/components/dialog/Dialog";
import {Alert, AlertContent, AlertIcon, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {AlarmClockPlus, BookCopy, ClipboardList} from "lucide-react";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import { useUser } from "@/context/UserContext";
import {Project, Task, Team} from "@/types/types";
import {SearchSelect, SearchSelectItem, SearchSelectRef} from "@marraph/daisy/components/searchselect/SearchSelect";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";

export const CreateTimeEntryDialog = React.forwardRef<HTMLDialogElement, React.DialogHTMLAttributes<HTMLDialogElement>>(({ className, ...props}, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const taskRef = useRef<SearchSelectRef>(null);
    const projectRef = useRef<SearchSelectRef>(null);
    const [comment, setComment] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [projectSelected, setProjectSelected] = useState<string | null>(null);
    const [taskSelected, setTaskSelected] = useState<string | null>(null);
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

    const getProject = (task: string) => {
        let project: string = "";
        user?.teams.forEach((team: Team) => {
            team.projects.forEach((proj: Project) => {
                proj.tasks.forEach((tsk: Task) => {
                    if (tsk.name === task) {
                        project = proj.name;
                    }
                });
            });
        });
        return project;
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

    const handleProjectChange = (project: string) => {
        if (project === projectSelected){
            setProjectSelected(null);
            projectRef.current?.setValue(null);
            setProjectSelected(null);
        } else {
            setProjectSelected(project);
            projectRef.current?.setValue(project);
        }
    };

    const handleTaskChange = (task: string) => {
        if (task === taskSelected){
            setTaskSelected(null);
            taskRef.current?.setValue(null);
        } else {
            setTaskSelected(task);
            taskRef.current?.setValue(task);
        }
    };

    const handleCloseClick = () => {
        getDialogRef().current?.close();
        taskRef.current?.reset();
        projectRef.current?.reset();
        setComment("");
        setProjectSelected(null);
        setTaskSelected(null);
    }

    return (
        <>
            <Button text={"New Entry"} theme={"white"} className={"w-min h-8"} onClick={() => getDialogRef().current?.showModal()}>
                <AlarmClockPlus size={20} className={"mr-2"}/>
            </Button>

            <div className={cn("flex items-center justify-center")}>
                <Dialog className={cn("border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible space-y-2")} {...props} ref={getDialogRef()}>
                    <div className={"flex flex-row justify-between items-center space-x-4 pt-4 pb-2 px-4"}>
                        <span className={"text-white text-lg"}>{"Create a new entry"}</span>
                        <CloseButton className={cn("h-min w-min", className)} onClick={handleCloseClick}/>
                    </div>

                    <Textarea placeholder={"Comment"} className={"px-4 h-12 w-full bg-black placeholder-placeholder focus:text-gray"} spellCheck={false}
                              onChange={(e) => setComment(e.target.value)} value={comment}>
                    </Textarea>

                    <div className={"flex flex-row items-center space-x-2 px-4"}>
                        <SearchSelect buttonTitle={"Project"} ref={projectRef} icon={<BookCopy size={16}/>} size={"small"}>
                            {!taskSelected && getProjects().map((project) => (
                                <SearchSelectItem key={project} title={project} onClick={() => handleProjectChange(project)}></SearchSelectItem>
                            ))}
                            {taskSelected && getProject(taskSelected) &&
                                <SearchSelectItem title={getProject(taskSelected)} onClick={() => handleProjectChange(getProject(taskSelected))}></SearchSelectItem>
                            }
                        </SearchSelect>

                        <SearchSelect buttonTitle={"Task"} ref={taskRef} icon={<ClipboardList size={16}/>} size={"small"}>
                            {!projectSelected && getAllTasks().map((task) => (
                                <SearchSelectItem key={task} title={task} onClick={() => handleTaskChange(task)}></SearchSelectItem>
                            ))}
                            {projectSelected && getTasks(projectSelected).map((task) => (
                                <SearchSelectItem key={task} title={task} onClick={() => handleTaskChange(task)}></SearchSelectItem>
                            ))}
                        </SearchSelect>
                    </div>

                    <Seperator/>
                    <div className={cn("flex flex-row justify-end px-4 py-2", className)}>
                        <Button text={"Create"} theme={"white"} onClick={createTimeEntry} disabled={comment.trim() === "" && !projectSelected && !taskSelected}
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