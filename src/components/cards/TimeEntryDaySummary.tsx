import React from "react";
import {TimeEntry} from "@/types/types";
import {Badge} from "@marraph/daisy/components/badge/Badge";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    entries: TimeEntry[] | undefined;
}

export const TimeEntryDaySummary: React.FC<Props> = ({ entries, className, ...props }) => {

    const sumDuration = () => {
        if (entries === undefined) return 0;
        let totalDuration = 0.0;

        for (const entry of entries) {
            const endDate = new Date(entry.endDate);
            const startDate = new Date(entry.startDate);

            const duration = endDate.getHours() - startDate.getHours();
            const hours = parseFloat(duration.toString());
            totalDuration += hours;
        }
    }

    return (
        <div
            className={"bg-badgegray border border-white border-opacity-20 rounded-b-lg px-4 flex flex-row justify-between items-center"}>
            <Badge text={entries?.length.toString() + (entries?.length === 1 ? " ENTRY" : " ENTRIES")}
                   size={"small"}
                   className={"rounded-md bg-selectwhite text-dark my-3"}>
            </Badge>
            <div className={"flex flex-row items-center space-x-2"}>
                <span className={"text-sm text-gray"}>{"Total Duration:"}</span>
                <span className={"text-base text-white"}>{sumDuration() + "h"}</span>
            </div>
        </div>
    );
}