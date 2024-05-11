import React from "react";
import {Drawer} from "@/components/Drawer";
import {SearchField} from "@/components/SearchField";
import {TaskTable} from "@/components/tables/TaskTable";
import {Button, ButtonIcon} from "@marraph/daisy/components/button/Button";
import {ListFilter, SquarePen} from "lucide-react";
import {SwitchButton} from "@marraph/daisy/components/switchbutton/SwitchButton";

export default function Home() {

  return (
    <div className={"flex flex-row"}>
        <Drawer></Drawer>
        <div className={"w-full flex flex-col float-end space-y-2"}>
            <SearchField></SearchField>
            <div className={"w-min flex flex-row justify-items-end space-x-2 text-nowrap right-0"}>
                <Button text={"Create Task"} theme={"white"}>
                    <ButtonIcon icon={<SquarePen size={20} />} />
                </Button>
                <SwitchButton firstTitle={"Table"} secondTitle={"Card"} />
                <Button text={"Filter"}>
                    <ButtonIcon icon={<ListFilter size={20} />} />
                </Button>
            </div>
            <TaskTable></TaskTable>
        </div>
    </div>

  );
}
