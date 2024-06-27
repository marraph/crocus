import React from "react";
import {Status, TaskElement} from "@/types/types";
import {KanbanCard} from "@/components/cards/KanbanCard";

interface TaskProps {
    taskElements: TaskElement[];
}

export const KanbanView: React.FC<TaskProps> = ({ taskElements }) => {

    const status = ["PENDING", "PLANING", "STARTED", "TESTED"];

    function isStatus(value: string): value is Status {
        return ["PENDING", "PLANING", "STARTED", "TESTED"].includes(value);
    }

    return (
        <>
            <div className={"grid grid-cols-4 gap-9 pt-4"}>
                {status.map((status, index) => isStatus(status) &&
                    <KanbanCard key={index}
                                taskElements={taskElements.filter(task => task.status === status)}
                                status={status}/>
                )}
            </div>
        </>
    );
}