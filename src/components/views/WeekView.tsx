import {TimeEntry} from "@/types/types";
import React from "react";
import {ProjectBadge} from "@/components/badges/ProjectBadge";
import {EntryTitleBadge} from "@/components/badges/EntryTaskBadge";
import {formatTime} from "@/utils/format";

interface TimeEntryProps {
    timeEntries: TimeEntry[];
    weekDates: Date[];
}

export const WeekView: React.FC<TimeEntryProps> = ({ weekDates, timeEntries }) => {

    const days = [
        {name: "Monday", day: weekDates[0]},
        {name: "Tuesday", day: weekDates[1]},
        {name: "Wednesday", day: weekDates[2]},
        {name: "Thursday", day: weekDates[3]},
        {name: "Friday", day: weekDates[4]},
    ];

    return (
            <div className={"flex flex-row rounded-lg border border-white border-opacity-20 mt-4"}>
                {days.map((day, index) => (
                    <div key={index} className={"h-[836px] w-full bg-black rounded-lg border-x border-white border-opacity-20"}>
                        <div className={"w-full border-b border-white border-opacity-20 p-2"}>
                            <span className={""}>{day.name}</span>
                        </div>
                        <div className={"h-[800px] w-full"}>
                            {timeEntries.map((entry, index) => (
                                <div key={index}
                                     className={"flex flex-col space-y-2 border-b border-white border-opacity-20 p-2"}>
                                    <span className={"text-sm"}>{formatTime(entry.startDate) + " - " + formatTime(entry.endDate)}</span>
                                    <div className={"flex flex-row space-x-2"}>
                                        {entry.project && <ProjectBadge title={entry.project.name}/>}
                                        {entry.task && <EntryTitleBadge title={entry.task.name}/>}
                                    </div>
                                    <span className={"text-sm text-gray"}>{entry.comment}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                ))}
            </div>
    );
}