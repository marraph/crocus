import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import React from "react";
import {cn} from "@/utils/cn";
import {useRouter} from "next/navigation";
import {TopicBadge} from "@/components/badges/TopicBadge";
import {PriorityBadge} from "@/components/badges/PriorityBadge";
import {Box, CalendarDays, Users} from "lucide-react";
import {ProfileBadge} from "@/components/badges/ProfileBadge";
import { TaskElement } from "@/types/types";

interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
    taskElement: TaskElement;
}

export const TaskCard: React.FC<TaskCardProps> = ({ taskElement, className, ...props }) => {
    const router = useRouter();

    return (
        <div className={cn("bg-black rounded-lg border border-edge flex flex-col w-full cursor-pointer hover:bg-dark overflow-hidden", className)}
             onClick={() => router.push(`/tasks/${taskElement.id}`)} {...props}>

            <div className={cn("flex flex-col p-2 space-y-2", className)}>
                <span className={cn("text-md", className)}>{taskElement.name}</span>
                <div className={"flex flex-row space-x-2"}>
                    <TopicBadge title={taskElement.topic?.title} color={"error"}/>
                    <ProfileBadge name={taskElement.createdBy.name}/>
                    <PriorityBadge priority={taskElement.priority}/>
                </div>
            </div>

            <Seperator/>

            <div className={cn("flex flex-col p-2 space-y-2", className)}>
                <div className={"flex flex-row items-center space-x-2 text-gray"}>
                    <Users size={16}/>
                    <span className={cn("text-sm", className)}>{taskElement.team?.name}</span>
                </div>
                <div className={"flex flex-row items-center space-x-2 text-gray"}>
                    <Box size={16}/>
                    <span className={cn("text-sm", className)}>{taskElement.project?.name}</span>
                </div>
                <div className={"flex flex-row items-center space-x-2 text-gray"}>
                    <CalendarDays size={16}/>
                    <span className={cn("text-sm", className)}>{taskElement.deadline?.toString()}</span>
                </div>
            </div>
        </div>
    );
}