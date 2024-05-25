import React from "react";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import {StatusBadge} from "@/components/badges/StatusBadge";


interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
    writer: string;
    message?: string;
    change?: string;
    oldValue?: string;
    newValue?: string;
    date: string;
    type: "message" | "change";
}

const path = "/image.png";

export const Message: React.FC<MessageProps> = ({ change, oldValue, newValue, writer, message, date, className, ...props }) => {
    return (
        (props.type === "message") ?
            <div className={"flex flex-row space-x-2"}>
                <div className={"max-w-96 flex flex-col bg-black rounded-xl space-y-2 p-2"} {...props}>
                    <div className={"flex flex-row items-center space-x-2"}>
                        <Avatar img_url={path} size={15}/>
                        <span className={"text-placeholder text-xs"}>{writer}</span>
                    </div>
                    <span className={"text-sm text-gray"}>{message}</span>
                </div>
                <span className={"text-placeholder text-xs pt-2"}>{date}</span>
            </div>
            :
            <div className={"flex flex-row space-x-2"}>
                <div className={"max-w-96 flex flex-col bg-black bg-opacity-30 border border-white border-opacity-20 " +
                    "rounded-xl space-y-2 p-2"} {...props}>
                    <div className={"flex flex-row text-sm text-gray space-x-1 items-center"}>
                        <span className={"text-white"}>{writer}</span>
                        <span>changed the</span>
                        <span className={"text-white"}>{change}</span>
                        <span>from</span>
                        <StatusBadge title={"todo"} color={"warning"} className={"px-0.5 py-0"}/>
                        <span>to</span>
                        <StatusBadge title={"done"} color={"success"} className={"px-0.5 py-0"}/>
                    </div>
                </div>
                <span className={"text-placeholder text-xs pt-2"}>{date}</span>
            </div>
    )
}