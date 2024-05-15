"use client";

import React, {useState} from "react";
import {TaskTable} from "@/components/tables/TaskTable";
import {SwitchButton} from "@marraph/daisy/components/switchbutton/SwitchButton";
import {TaskCreateDialog} from "@/components/dialogs/TaskCreateDialog";
import {TaskCardView} from "@/components/tables/TaskCardView";
import {FilterContext} from "@/components/contextmenus/FilterContext";

export default function Home() {
    const [viewMode, setViewMode] = useState('Table');

    const toggleViewMode = () => {
        setViewMode(viewMode === 'Table' ? 'Card' : 'Table');
    }

  return (
    <div className={"h-full flex flex-col"}>
        <div className={"w-full flex flex-row pr-8 text-nowrap justify-between"}>
            <span className={"text-xl ml-8"}>{"Tasks"}</span>
            <div className={"flex flex-row justify-end space-x-2 h-8 z-10"}>
                <TaskCreateDialog></TaskCreateDialog>
                <SwitchButton firstTitle={"Table"} secondTitle={"Card"} onClick={toggleViewMode} />
                <FilterContext></FilterContext>
            </div>
        </div>
        {viewMode === 'Table' ? (
            <TaskTable></TaskTable>
        ) : (
            <TaskCardView></TaskCardView>
        )}
    </div>
  );
}
