import {Absence, TimeEntry} from "@/types/types";
import React, {useMemo} from "react";
import {ProjectBadge} from "@/components/badges/ProjectBadge";
import {EntryTitleBadge} from "@/components/badges/EntryTaskBadge";
import {formatTime} from "@/utils/format";
import {cn} from "@/utils/cn";
import {Week} from "@/app/timetracking/page";

interface TimeEntryProps {
    timeEntries: TimeEntry[] | undefined;
    absences: Absence[] | undefined;
    week: Week;
}

export const WeekView: React.FC<TimeEntryProps> = ({ week, timeEntries }) => {
    const days = useMemo(() => [
        {name: "Monday", day: week.monday},
        {name: "Tuesday", day: week.tuesday},
        {name: "Wednesday", day: week.wednesday},
        {name: "Thursday", day: week.thursday},
        {name: "Friday", day: week.friday},
        {name: "Saturday", day: week.saturday},
        {name: "Sunday", day: week.sunday},
    ], [week]);

    if (!timeEntries) return null;

    return (
            <div className={"w-full h-full flex flex-row rounded-t-lg border border-edge border-b-0"}>
                {days.map((day, index) => (
                    <div key={index}
                         className={cn("h-full w-1/5 bg-black rounded-lg border-x border-edge",
                             day.name === "Friday" ? "border-x-0 rounded-l-none" : "border-l-0 rounded-r-none"
                         )}
                    >
                        <div className={"w-full border-b border-edge p-2"}>
                            <span className={"text-marcador text-sm font-medium"}>{day.name}</span>
                        </div>
                        <div className={"h-[full]"}>
                            {timeEntries.map((entry, index) => {
                                const startDate = new Date(entry.startDate);
                                const endDate = new Date(entry.endDate);

                                return startDate.getDay() === day.day.getDay() && (
                                    <div key={index}
                                         className={"flex flex-col space-y-2 border-b border-edge p-2"}>
                                        <span
                                            className={"text-sm"}>{formatTime(startDate) + " - " + formatTime(endDate)}</span>
                                        {entry.project && <ProjectBadge title={entry.project.name}/>}
                                        {entry.task && <EntryTitleBadge title={entry.task.name}/>}
                                        <span className={"text-sm text-gray"}>{entry.comment}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                ))}
            </div>
    );
}