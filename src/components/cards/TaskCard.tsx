import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import React from "react";
import {cn} from "@/utils/cn";
import {useRouter} from "next/navigation";

const path = "/image.png";

interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
    _id: number;
    title: string;
    topic: string;
    priority: string;
    team: string;
    project: string;
    status: string;
    createdAt: string;
    createdBy: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ _id, title, topic, team, project, status, priority, className, createdAt, createdBy, ...props }) => {
    const router = useRouter();

    return (
        <div className={cn("bg-black rounded-lg border border-white border-opacity-20 flex flex-col w-72 cursor-pointer hover:bg-dark", className)}
             onClick={() => router.push(`/tasks/${_id}`)}>

            <div className={cn("flex flex-col p-2 space-y-2", className)}>
                <div className={"flex flex-row space-x-2"}>
                    <span className={cn("text-lg", className)}>{title}</span>
                    <Badge text={_id.toString()} className={"text-xs w-max bg-placeholder text-gray px-2 py-0.5 rounded-md"}></Badge>
                </div>
                <Badge text={topic} className={cn("bg-success bg-opacity-20 text-success rounded-lg w-max px-2 py-0.5 text-xs", className)}></Badge>
            </div>

            <Seperator/>

            <div className={cn("flex flex-col p-2 space-y-2", className)}>
                <span className={cn("text-sm text-gray", className)}>{team}</span>
                <span className={cn("text-sm text-gray", className)}>{project}</span>
                <span className={cn("text-sm text-gray", className)}>{priority}</span>
                <span className={cn("text-sm text-gray", className)}>{status}</span>
            </div>

            <Seperator/>

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