import React from "react";
import {Status, TaskElement} from "@/types/types";
import {KanbanCard} from "@/components/cards/KanbanCard";

interface TaskProps {
    taskElements: TaskElement[];
}

export const KanbanView: React.FC<TaskProps> = ({ taskElements }) => {

    const status = ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"];

    function isStatus(value: string): value is Status {
        return ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"].includes(value);
    }

    return (
        <>
            <div className={"grid grid-cols-4 gap-9 pt-4"}>
                {status.map((status) => (
                    isStatus(status) &&
                        <KanbanCard key={status} taskElements={taskElements} status={status}/>
                ))}
            </div>
        </>
    );
}