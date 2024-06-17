import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import React from "react";
import {cn} from "@/utils/cn";
import {useRouter} from "next/navigation";
import {TopicBadge} from "@/components/badges/TopicBadge";
import {StatusBadge} from "@/components/badges/StatusBadge";
import {PriorityBadge} from "@/components/badges/PriorityBadge";
import {BookCopy, CalendarDays, Users} from "lucide-react";
import {ProfileBadge} from "@/components/badges/ProfileBadge";

const path = "/image.png";

interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
    _id: number;
    title: string;
    topic?: string;
    priority?: string;
    team?: string;
    project?: string;
    status?: string;
    createdAt: string;
    createdBy: string;
    dueDate?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ _id, title, topic, team, project, status, priority, className, createdAt, createdBy, dueDate, ...props }) => {
    const router = useRouter();

    return (
        <div className={cn("bg-black rounded-lg border border-white border-opacity-20 flex flex-col w-72 cursor-pointer hover:bg-dark overflow-hidden", className)}
             onClick={() => router.push(`/tasks/${_id}`)} {...props}>

            <div className={cn("flex flex-col p-2 space-y-2", className)}>
                <div className={"flex flex-row justify-between space-x-2"}>
                    <span className={cn("text-lg", className)}>{title}</span>
                    <PriorityBadge priority={priority}/>
                </div>
                <div className={"flex flex-row space-x-2"}>
                    <StatusBadge title={status} color={"warning"}/>
                    <TopicBadge title={topic} color={"error"}/>
                </div>
            </div>

            <Seperator/>

            <div className={cn("flex flex-col p-2 space-y-2", className)}>
                <div className={"flex flex-row items-center space-x-2 text-gray"}>
                    <Users size={16}/>
                    <span className={cn("text-sm", className)}>{team}</span>
                </div>
                <div className={"flex flex-row items-center space-x-2 text-gray"}>
                    <BookCopy size={16}/>
                    <span className={cn("text-sm", className)}>{project}</span>
                </div>
                <div className={"flex flex-row items-center space-x-2 text-gray"}>
                    <CalendarDays size={16}/>
                    <span className={cn("text-sm", className)}>{dueDate}</span>
                </div>
            </div>

            <Seperator/>
            <div className={"m-2 mt-1"}>
                <ProfileBadge name={createdBy}/>
            </div>
        </div>
    );
}