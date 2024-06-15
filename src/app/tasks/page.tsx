"use client";

import React, {useCallback, useEffect, useRef, useState} from "react";
import {TaskTable} from "@/components/views/TaskTable";
import {SwitchButton} from "@marraph/daisy/components/switchbutton/SwitchButton";
import {CreateTaskDialog} from "@/components/dialogs/CreateTaskDialog";
import {TaskCardView} from "@/components/views/TaskCardView";
import {FilterContextMenu} from "@/components/contextmenus/FilterContextMenu";
import {LoaderCircle, OctagonAlert} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {Project, Task, TaskElement, Team} from "@/types/types";
import {FilterRef} from "@marraph/daisy/components/filter/Filter";
import {Skeleton, SkeletonElement} from "@marraph/daisy/components/skeleton/Skeleton";


export default function Tasks() {
    const [viewMode, setViewMode] = useState(true);
    const filterRef = useRef<FilterRef>(null);
    const [update, setUpdate] = useState(0);
    const [taskElements, setTaskElements] = useState<TaskElement[]>([]);
    const { data: User, isLoading: userLoading, error: userError } = useUser();

    useEffect(() => {
        if (User) {
            const elements = getTaskElements();
            setTaskElements(elements);
        }
    }, [User, update]);

    const getTaskElements = useCallback((): TaskElement[] => {
        let taskElements: TaskElement[] = [];
        User?.teams?.forEach((team: Team) => {
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

        console.log('Initial taskElements:', taskElements);

        const filters = filterRef.current?.getSelectedItems() ?? {};
        const hasFilters = Object.values(filters).some(value => value !== null && value !== '');

        if (hasFilters) {
            console.log('Filters:', filters);

            taskElements = taskElements.filter((task) => {
                if (filters["Team"] && task.team?.name !== filters["Team"]) return false;
                if (filters["Project"] && task.project?.name !== filters["Project"]) return false;
                if (filters["Topic"] && task.topic?.title !== filters["Topic"]) return false;
                if (filters["Status"] && task.status !== filters["Status"]) return false;
                if (filters["Priority"] && task.priority !== filters["Priority"]) return false;
                if (filters["Creator"] && task.createdBy.name !== filters["Creator"]) return false;
                return true;
            });
            console.log('Filtered taskElements:', taskElements);
        }

        return taskElements;
    }, [User]);

    if (User === undefined) return null;

    return (
        <div className={"h-full flex flex-col"}>
            <div className={"w-full flex flex-row items-center text-nowrap justify-between"}>
                <div className={"flex flex-row items-center space-x-2 z-10"}>
                    <CreateTaskDialog/>
                    <FilterContextMenu ref={filterRef} onChange={() => setUpdate(update+1)}/>
                    <div className={"flex flex-row space-x-1"}>
                        <LoaderCircle size={14} className={"text-placeholder"}/>
                        <span className={"text-xs text-placeholder"}>{`${getTaskElements().length} OPEN`}</span>
                    </div>
                </div>
                <SwitchButton firstTitle={"Table"} secondTitle={"Card"} className={"h-8"} onClick={() => setViewMode(!viewMode)}/>
            </div>

            {viewMode ?
                <TaskTable taskElements={taskElements}/>
                :
                <TaskCardView taskElements={taskElements}/>
            }

        </div>
    );
}
