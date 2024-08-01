"use client";

import React, {useCallback, useEffect, useRef, useState} from "react";
import {TaskTable} from "@/components/views/TaskTable";
import {SwitchButton} from "@marraph/daisy/components/switchbutton/SwitchButton";
import {CreateTaskDialog} from "@/components/dialogs/tasks/CreateTaskDialog";
import {LoaderCircle, SquarePen} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {Project, Task, TaskElement, Team} from "@/types/types";
import {Button} from "@marraph/daisy/components/button/Button";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {CustomScroll} from "react-custom-scroll";
import {Filter, FilterRef} from "@/components/Filter";


export default function Tasks() {
    const [viewMode, setViewMode] = useState(true);
    const [update, setUpdate] = useState(0);
    const [taskElements, setTaskElements] = useState<TaskElement[]>([]);
    const dialogRef = useRef<DialogRef>(null);
    const filterRef = useRef<FilterRef>(null);
    const { data:user, isLoading:userLoading, error:userError } = useUser();

    const filterItems = [
        {
            name: "Status",
            values: ["Open", "In Progress", "Done"]
        },
        {
            name: "Priority",
            values: ["Low", "Medium", "High"]
        },
        {
            name: "Deadline",
            values: ["Today", "This Week", "This Month"]
        }
    ];

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
        return taskElements;
    }, [user]);

    if (user === undefined) return null;

    return (
        <div className={"h-screen flex flex-col space-y-4 p-8"}>
            <div className={"w-full flex flex-row items-center text-nowrap justify-between"}>
                <div className={"flex flex-row items-center space-x-2 z-10"}>
                    <Button text={"Create Task"}
                            theme={"white"}
                            onClick={() => {dialogRef.current?.show(); console.log(dialogRef.current)}}
                            icon={<SquarePen size={20} className={"mr-2"}/>}
                    />
                    <CreateTaskDialog ref={dialogRef}/>
                    <Filter title={"Filter"}
                            items={filterItems}
                            ref={filterRef}
                    />
                    <div className={"flex flex-row space-x-1"}>
                        <LoaderCircle size={14} className={"text-marcador"}/>
                        <span className={"text-xs text-marcador"}>{`${getTaskElements().length} OPEN`}</span>
                    </div>
                </div>
                <SwitchButton firstTitle={"Table"}
                              secondTitle={"Card"}
                              onClick={() => setViewMode(!viewMode)}
                />
            </div>

            {viewMode &&
                <div className={"overflow-hidden rounded-lg border border-edge"}>
                    <CustomScroll>
                        <div className={"rounded-lg bg-black h-screen"}>
                            <TaskTable taskElements={taskElements}/>
                        </div>
                    </CustomScroll>
                </div>
            }
        </div>
    );
}
