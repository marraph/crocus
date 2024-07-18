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
            <div className={"w-full h-full grid grid-cols-7 rounded-t-lg border border-edge border-b-0"}>
                {days.map((day, index) => (
                    <div key={index}
                         className={cn("h-full bg-black rounded-lg border-x border-edge",
                             day.name === "Sunday" ? "border-x-0 rounded-l-none" : "border-l-0 rounded-r-none"
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
                                         className={"border-b border-edge"}>
                                        <div className={"rounded-lg hover:bg-dark m-1 p-1 cursor-pointer space-y-1 overflow-hidden"}>
                                            <span className={"text-sm"}>{formatTime(startDate) + " - " + formatTime(endDate)}</span>
                                            {entry.project &&
                                                <ProjectBadge title={entry.project.name}
                                                              className={"max-w-8"}
                                                />
                                            }
                                            {entry.task &&
                                                <EntryTitleBadge title={entry.task.name}
                                                                 className={"w-min"}
                                                                 textClassName={"truncate"}
                                                />
                                            }
                                            <span className={"text-sm text-gray"}>{entry.comment}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                ))}
            </div>
    );
}