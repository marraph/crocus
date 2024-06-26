import React from "react";
import {Status, TaskElement} from "@/types/types";
import {TaskCard} from "@/components/cards/TaskCard";

interface KanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
    taskElements: TaskElement[];
    status: Status;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ taskElements, status, className }) => {

    return (
        <div className={"bg-badgegray border border-white border-opacity-20 rounded-lg flex flex-col justify-center " +
            "m-4 space-y-4"}>
            {taskElements.map((task, index) => (
                task.status === status &&
                    <TaskCard key={index} taskElement={task}/>
            ))}
        </div>
    );
}