import React from "react";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";


interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
    writer: string;
    message: string;
    date: string;
    type: "message" | "change";
}

const path = "/image.png";

export const Message: React.FC<MessageProps> = ({ writer, message, date, className, ...props }) => {
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
                <div className={"max-w-96 flex flex-col bg-black rounded-xl space-y-2 p-2"} {...props}>
                    <div className={"flex flex-row items-center space-x-2"}>
                        <Avatar img_url={path} size={15}/>
                        <span className={"text-placeholder text-xs"}>{writer}</span>
                    </div>
                    <span className={"text-sm text-gray"}>{message}</span>
                </div>
                <span className={"text-placeholder text-xs pt-2"}>{date}</span>
            </div>
    )
}