import React from "react";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import {formatTimeDifference} from "@/utils/format";

interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
    sender: string;
    task: string;
    date: Date;
    type: string;
    unread: boolean;
}

const path = "/image.png";

export const Notification: React.FC<NotificationProps> = ({ unread, sender, type, task, date }) => {

    return (
        <div className={"flex flex-row items-center w-64 mx-2 my-1 p-2 space-x-2 rounded-lg hover:bg-dark-light cursor-pointer"}>
            <Avatar img_url={path} size={20} className={"h-max"}/>
            {type === "message" &&
                <div className={"text-xs text-gray w-full"}>
                    <div className={"w-full flex flex-row items-center justify-between"}>
                        <div className={"flex flex-row items-center space-x-2"}>
                            <span className={"text-sm text-white"}>{"New message"}</span>
                            {unread &&
                                <div className={"h-2 w-2 rounded-full bg-blue bg-opacity-60 border border-edge"}/>
                            }
                        </div>
                        <span className={"text-marcador text-xs"}>{formatTimeDifference(date, new Date())}</span>
                    </div>
                    <span>{"by " + sender + " in " + task}</span>
                </div>
            }
            {type === "change" &&
                <div className={"text-xs text-gray w-full"}>
                    <div className={"w-full flex flex-row items-center justify-between"}>
                        <div className={"flex flex-row items-center space-x-2"}>
                            <span className={"text-sm text-white"}>{"New change"}</span>
                            {unread &&
                                <div className={"h-2 w-2 rounded-full bg-blue bg-opacity-60 border border-edge"}/>
                            }
                        </div>
                        <span className={"text-marcador text-xs"}>{formatTimeDifference(date, new Date())}</span>
                    </div>
                    <span>{"by " + sender + " in " + task}</span>
                </div>
            }
        </div>
    )
}