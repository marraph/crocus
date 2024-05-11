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
        <div className={"w-full flex flex-col space-y-4"}>
            <div className={"w-full py-2 px-8 flex flex-row justify-end border-b border-white border-opacity-20"}>
                <SearchField></SearchField>
            </div>
            <div className={"h-full flex flex-col"}>
                <div className={"w-full flex flex-row pr-8 text-nowrap justify-between"}>
                    <span className={"text-xl ml-8"}>{"Tasks"}</span>
                    <div className={"flex flex-row justify-end space-x-2"}>
                        <Button text={"Create Task"} theme={"white"} className={"w-min"}>
                            <ButtonIcon icon={<SquarePen size={20}/>}/>
                        </Button>
                        <SwitchButton firstTitle={"Table"} secondTitle={"Card"}/>
                        <Button text={"Filter"} className={"w-min"}>
                            <ButtonIcon icon={<ListFilter size={20}/>}/>
                        </Button>
                    </div>
                </div>
                <TaskTable></TaskTable>
            </div>
        </div>
    </div>

  );
}
