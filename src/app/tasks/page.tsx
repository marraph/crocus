"use client";

import React, {useCallback, useEffect, useRef, useState} from "react";
import {TaskTable} from "@/components/views/TaskTable";
import {SwitchButton} from "@marraph/daisy/components/switchbutton/SwitchButton";
import {CreateTaskDialog} from "@/components/dialogs/tasks/CreateTaskDialog";
import {FilterContextMenu} from "@/components/contextmenus/FilterContextMenu";
import {LoaderCircle, SquarePen} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {Project, Task, TaskElement, Team} from "@/types/types";
import {Button} from "@marraph/daisy/components/button/Button";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";


export default function Tasks() {
    const [viewMode, setViewMode] = useState(true);
    const filterRef = useRef<FilterRef>(null);
    const dialogRef = useRef<DialogRef>(null);
    const [update, setUpdate] = useState(0);
    const [taskElements, setTaskElements] = useState<TaskElement[]>([]);
    const [filters , setFilters] = useState<Filter[]>([]);
    const { data:user, isLoading:userLoading, error:userError } = useUser();

    console.log(user)

    useEffect(() => {
        if (user) {
            const elements = getTaskElements();
            setTaskElements(elements);
        }
    }, [user, update]);

    const getTaskElements = useCallback((): TaskElement[] => {
        let taskElements: TaskElement[] = [];
        user?.teams?.forEach((team: Team) => {
            team.projects?.forEach((project: Project) => {
                project.tasks?.forEach((task: Task) => {
                    if (task.isArchived) return;
                    taskElements.push({
                        id: task.id,
                        name: task.name,
                        description: task.description,
                        topic: task.topic,
                        isArchived: task.isArchived,
                        duration: task.duration,
                        bookedDuration: task.bookedDuration,
                        deadline: task.deadline,
                        status: task.status,
                        priority: task.priority,
                        createdBy: task.createdBy,
                        createdDate: task.createdDate,
                        lastModifiedBy: task.lastModifiedBy,
                        lastModifiedDate: task.lastModifiedDate,
                        team: team,
                        project: project
                    });
                });
            });
        });

        console.log(filters);
        const hasFilters = Object.values(filters).some(value => value !== null);
        if (!hasFilters) return taskElements;

        return taskElements.filter((task) => {
            return filters.every(filter => {
                switch (filter.key) {
                    case "Team":
                        return filter.value === null || task.team?.name === filter.value;
                    case "Project":
                        return filter.value === null || task.project?.name === filter.value;
                    case "Topic":
                        return filter.value === null || task.topic?.title === filter.value;
                    case "Status":
                        return filter.value === null || task.status === filter.value;
                    case "Priority":
                        return filter.value === null || task.priority === filter.value;
                    case "Creator":
                        return filter.value === null || task.createdBy.name === filter.value;
                    default:
                        return true;
                }
            });
        });
    }, [user]);

    if (user === undefined) return null;

    const updateStateValue = (newValue: Filter[]) => {
        setFilters(newValue);
    };

    return (
        <div className={"h-screen flex flex-col space-y-4 p-8"}>
            <div className={"w-full flex flex-row items-center text-nowrap justify-between"}>
                <div className={"flex flex-row items-center space-x-2 z-10"}>
                    <Button text={"Create Task"}
                            theme={"white"}
                            size={"small"}
                            className={"w-min"}
                            onClick={() => {dialogRef.current?.show(); console.log(dialogRef.current)}}
                            icon={<SquarePen size={20} className={"mr-2"}/>}
                    />
                    <CreateTaskDialog ref={dialogRef}/>
                    <FilterContextMenu ref={filterRef}
                                       updateStateValue={updateStateValue}
                                       onChange={() => setUpdate(update+1)}
                    />
                    <div className={"flex flex-row space-x-1"}>
                        <LoaderCircle size={14} className={"text-marcador"}/>
                        <span className={"text-xs text-marcador"}>{`${getTaskElements().length} OPEN`}</span>
                    </div>
                </div>
                <SwitchButton firstTitle={"Table"}
                              secondTitle={"Card"}
                              className={"h-9"}
                              onClick={() => setViewMode(!viewMode)}
                />
            </div>

            {viewMode &&
                <div className={"border border-edge rounded-lg bg-black flex flex-col h-screen overflow-hidden"}>
                    <TaskTable taskElements={taskElements}/>
                </div>
            }
        </div>
    );
}
