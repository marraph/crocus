"use client";

import React, {useState} from "react";
import {TaskTable} from "@/components/tables/TaskTable";
import {Button, ButtonIcon} from "@marraph/daisy/components/button/Button";
import {ListFilter} from "lucide-react";
import {SwitchButton} from "@marraph/daisy/components/switchbutton/SwitchButton";
import {TaskCreateDialog} from "@/components/dialogs/TaskCreateDialog";
import {TaskCardView} from "@/components/tables/TaskCardView";


export default function Home() {
    const [viewMode, setViewMode] = useState('Table');

    const toggleViewMode = () => {
        setViewMode(viewMode === 'Table' ? 'Card' : 'Table');
    }

  return (
    <div className={"h-full flex flex-col"}>
        <div className={"w-full flex flex-row pr-8 text-nowrap justify-between"}>
            <span className={"text-xl ml-8"}>{"Tasks"}</span>
            <div className={"flex flex-row justify-end space-x-2"}>
                <TaskCreateDialog></TaskCreateDialog>
                <SwitchButton firstTitle={"Table"} secondTitle={"Card"} onClick={toggleViewMode} />
                <Button text={"Filter"} className={"w-min h-8"}>
                    <ButtonIcon icon={<ListFilter size={20}/>}/>
                </Button>
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
