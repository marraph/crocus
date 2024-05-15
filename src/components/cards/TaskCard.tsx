import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import React from "react";
import {cn} from "@/utils/cn";

const path = "/image.png";

interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    topic: string;
    team: string;
    project: string;
    status: string;
    createdAt: string;
    createdBy: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ title, topic, team, project, status, className, createdAt, createdBy, ...props }) => {
    return (
        <div className={cn("bg-black rounded-lg border border-white border-opacity-20 flex flex-col w-72 cursor-pointer hover:bg-dark", className)}>

            <div className={cn("flex flex-row items-center justify-between p-2", className)}>
                <span className={cn("text-lg", className)}>{title}</span>
                <Badge theme={"primary"} text={topic} className={cn("bg-success text-success w-max px-2 py-0.5 text-xs", className)}></Badge>
            </div>

            <Seperator />

            <div className={cn("flex flex-col p-2 space-y-2", className)}>
                <span className={cn("text-sm text-gray", className)}>{team}</span>
                <span className={cn("text-sm text-gray", className)}>{project}</span>
                <span className={cn("text-sm text-gray", className)}>{status}</span>
            </div>

            <Seperator />

            <div className={cn("flex flex-col p-2", className)}>
                <span className={cn("text-placeholder text-xs", className)}>{"CREATED"}</span>
                <div className={cn("flex flex-row items-center justify-between", className)}>
                    <span className={cn("text-gray text-sm", className)}>{createdAt}</span>
                    <div className={cn("flex flex-row items-center space-x-2", className)}>
                        <span className={cn("text-gray text-sm", className)}>{createdBy}</span>
                        <Avatar img_url={path} height={30} width={30}/>
                    </div>
                </div>
            </div>
        </div>
    );
}