"use client";

import React, {useState} from "react";
import {TaskTable} from "@/components/views/TaskTable";
import {SwitchButton} from "@marraph/daisy/components/switchbutton/SwitchButton";
import {TaskCreateDialog} from "@/components/dialogs/TaskCreateDialog";
import {TaskCardView} from "@/components/views/TaskCardView";
import {FilterContext} from "@/components/contextmenus/FilterContext";
import {OctagonAlert} from "lucide-react";
import {useTask} from "@/context/TaskContext";

export default function Home() {
    const [viewMode, setViewMode] = useState(true);

    const { data:User, isLoading:userLoading, error:userError } = useTask();

    return (
        <div className={"h-full flex flex-col"}>
            <div className={"w-full flex flex-row items-center text-nowrap justify-between"}>
                <div className={"flex flex-row items-center space-x-2 z-10"}>
                    <TaskCreateDialog/>
                    <FilterContext/>
                    <div className={"flex flex-row space-x-1"}>
                        <OctagonAlert size={15} className={"text-placeholder"}/>
                        <span className={"text-xs text-placeholder"}>{"2 OPEN"}</span>
                    </div>
                </div>
                <SwitchButton firstTitle={"Table"} secondTitle={"Card"} className={"h-8"} onClick={() => setViewMode(!viewMode)}/>
            </div>
            {viewMode ? (
                <TaskTable></TaskTable>
            ) : (
                <TaskCardView></TaskCardView>
            )}
        </div>
    );
}
