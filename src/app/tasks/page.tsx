"use client";

import React, {useState} from "react";
import {TaskTable} from "@/components/views/TaskTable";
import {SwitchButton} from "@marraph/daisy/components/switchbutton/SwitchButton";
import {CreateTaskDialog} from "@/components/dialogs/CreateTaskDialog";
import {TaskCardView} from "@/components/views/TaskCardView";
import {FilterContext} from "@/components/contextmenus/FilterContext";
import {OctagonAlert} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {Project, Task, Team} from "@/types/types";

export type TaskElement = {
    task: Task;
    project: Project;
    team: Team;
}
export default function Tasks() {
    const [viewMode, setViewMode] = useState(true);

    const { data:User, isLoading:userLoading, error:userError } = useUser();
    const taskElements: TaskElement[] = [];

    User?.teams?.forEach((team: Team) => {
        team.projects?.forEach((project: Project) => {
            project.tasks?.forEach((task: Task) => {
                taskElements.push({
                    task,
                    project,
                    team
                });
            });
        });
    });

    return (
        <div className={"h-full flex flex-col"}>
            <div className={"w-full flex flex-row items-center text-nowrap justify-between"}>
                <div className={"flex flex-row items-center space-x-2 z-10"}>
                    <CreateTaskDialog/>
                    <FilterContext/>
                    <div className={"flex flex-row space-x-1"}>
                        <OctagonAlert size={15} className={"text-placeholder"}/>
                        <span className={"text-xs text-placeholder"}>{"2 OPEN"}</span>
                    </div>
                </div>
                <SwitchButton firstTitle={"Table"} secondTitle={"Card"} className={"h-8"} onClick={() => setViewMode(!viewMode)}/>
            </div>
            {viewMode ? (
                <TaskTable taskElements={taskElements}></TaskTable>
            ) : (
                <TaskCardView taskElements={taskElements}></TaskCardView>
            )}
        </div>
    );
}
