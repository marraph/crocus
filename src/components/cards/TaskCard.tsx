import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";

const path = "/image.png";

export function TaskCard() {
    return (
        <div className={"bg-black rounded-lg border border-white border-opacity-20 flex flex-col w-72"}>

            <div className={"flex flex-row items-center p-2 space-x-2"}>
                <span className={"text-lg"}>{"Titel"}</span>
                <Badge theme={"primary"} text={"topic"} className={"w-min px-3 py-1 text-gray text-xs"}></Badge>
            </div>

            <Seperator />

            <div className={"flex flex-col p-2 space-y-2"}>
                <span>{"Team"}</span>
                <span>{"Project"}</span>
                <span>{"Status"}</span>
            </div>

            <Seperator />

            <div className={"flex flex-col p-2"}>
                <span className={"text-placeholder text-xs"}>{"CREATED"}</span>
                <div className={"flex flex-row items-center justify-between"}>
                    <span className={"text-gray text-sm"}>{"2024-09-10"}</span>
                    <div className={"flex flex-row items-center space-x-2"}>
                        <span className={"text-gray text-sm"}>{"Name"}</span>
                        <Avatar img_url={path} height={30} width={30}/>
                    </div>
                </div>
            </div>


        </div>
    );
}