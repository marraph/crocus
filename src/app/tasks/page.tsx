import React from "react";
import {TaskTable} from "@/components/tables/TaskTable";
import {Button, ButtonIcon} from "@marraph/daisy/components/button/Button";
import {ListFilter, SquarePen} from "lucide-react";
import {SwitchButton} from "@marraph/daisy/components/switchbutton/SwitchButton";
import {TaskCreateDialog} from "@/components/dialogs/TaskCreateDialog";


export default function Home() {
  return (
    <div className={"h-full flex flex-col"}>
        <div className={"w-full flex flex-row pr-8 text-nowrap justify-between"}>
            <span className={"text-xl ml-8"}>{"Tasks"}</span>
            <div className={"flex flex-row justify-end space-x-2"}>
                <TaskCreateDialog></TaskCreateDialog>
                <SwitchButton firstTitle={"Table"} secondTitle={"Card"}/>
                <Button text={"Filter"} className={"w-min h-8"}>
                    <ButtonIcon icon={<ListFilter size={20}/>}/>
                </Button>
            </div>
        </div>
        <TaskTable></TaskTable>
    </div>
  );
}
