import React from "react";
import {TimeEntry} from "@/types/types";
import {Badge} from "@marraph/daisy/components/badge/Badge";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    entries: TimeEntry[] | undefined;
}

export const TimeEntryDaySummary: React.FC<Props> = ({ entries, className, ...props }) => {

    const sumDuration = () => {
        if (!entries) return 0;
        let totalDuration = 0.0;

        for (const entry of entries) {
            const endDate = new Date(entry.endDate);
            const startDate = new Date(entry.startDate);

            const duration = endDate.getHours() - startDate.getHours();
            const hours = parseFloat(duration.toString());
            totalDuration += hours;
        }
        return totalDuration;
    }

    return (
        <div className={"bg-dark-light border border-edge rounded-b-lg px-4 flex flex-row justify-between items-center"}>
            <Badge text={
                entries === undefined ? "0 ENTRIES" :
                entries?.length.toString() + (entries?.length === 1 ? " ENTRY" : " ENTRIES")
            }
                   size={"small"}
                   className={"rounded-md bg-white-dark text-dark my-3"}
            />
            <div className={"flex flex-row items-center space-x-2"}>
                <span className={"text-sm text-gray"}>{"Total Duration:"}</span>
                <span className={"text-base text-white"}>{sumDuration() + "h"}</span>
            </div>
        </div>
    );
}