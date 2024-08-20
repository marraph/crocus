"use client";

import React, { useCallback } from "react";
import {TimeEntry} from "@/types/types";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import moment from "moment";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    entries: TimeEntry[] | undefined;
}

export const TimeEntryDaySummary: React.FC<Props> = ({ entries, className, ...props }) => {

    const sumDuration = useCallback(() => {
        if (!entries) return 0;
        let totalDuration = 0.0;

        for (const entry of entries) {
            const startDate = moment(entry.startDate);
            const endDate = moment(entry.endDate);

            const hours = moment.duration(endDate.diff(startDate)).asHours();
            totalDuration += hours;
        }
        return totalDuration;
    }, [entries]);

    return (
        <div className={"bg-zinc-200 dark:bg-dark-light border-t border-zinc-300 dark:border-edge rounded-b-lg px-4 flex flex-row justify-between items-center"}>
            <Badge text={
                entries === undefined ? "0 ENTRIES" :
                entries?.length.toString() + (entries?.length === 1 ? " ENTRY" : " ENTRIES")
            }
                   size={"small"}
                   className={"rounded-md bg-zinc-700 dark:bg-white-dark text-zinc-200 dark:text-dark my-3 py-0.5 px-1.5"}
            />
            <div className={"flex flex-row items-center space-x-2"}>
                <span className={"text-sm text-zinc-500 dark:text-gray"}>{"Total Duration:"}</span>
                <span className={"text-base text-zinc-800 dark:text-white"}>{sumDuration() + "h"}</span>
            </div>
        </div>
    );
}