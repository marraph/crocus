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
        <div className={"flex flex-row items-center w-64 mx-2 my-1 p-2 space-x-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-dark-light cursor-pointer"}>
            <Avatar img_url={path} size={20} className={"h-max"}/>
            {type === "message" &&
                <div className={"text-xs text-zinc-800 dark:text-gray w-full"}>
                    <div className={"w-full flex flex-row items-center justify-between"}>
                        <div className={"flex flex-row items-center space-x-2"}>
                            <span className={"text-sm"}>{"New message"}</span>
                            {unread &&
                                <div className={"h-2 w-2 rounded-full bg-topicblue bg-opacity-60 border border-zinc-300 dark:border-edge"}/>
                            }
                        </div>
                        <span className={"text-zinc-400 dark:text-marcador text-xs"}>{formatTimeDifference(date, new Date())}</span>
                    </div>
                    <span className={"text-zinc-400 dark:text-marcador"}>{"by " + sender + " in " + task}</span>
                </div>
            }
            {type === "change" &&
                <div className={"text-xs text-zinc-800 dark:text-gray w-full"}>
                    <div className={"w-full flex flex-row items-center justify-between"}>
                        <div className={"flex flex-row items-center space-x-2"}>
                            <span className={"text-sm"}>{"New change"}</span>
                            {unread &&
                                <div className={"h-2 w-2 rounded-full bg-topicblue bg-opacity-60 border border-zinc-300 dark:border-edge"}/>
                            }
                        </div>
                        <span className={"text-zinc-400 dark:text-marcador text-xs"}>{formatTimeDifference(date, new Date())}</span>
                    </div>
                    <span className={"text-zinc-400 dark:text-marcador"}>{"by " + sender + " in " + task}</span>
                </div>
            }
        </div>
    )
}