import {Absence, TaskElement, TimeEntry} from "@/types/types";
import React, {useMemo, useState} from "react";
import {ProjectBadge} from "@/components/badges/ProjectBadge";
import {EntryTitleBadge} from "@/components/badges/EntryTaskBadge";
import {formatTime} from "@/utils/format";
import {cn} from "@/utils/cn";
import {Week} from "@/app/timetracking/page";
import {Clock7} from "lucide-react";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {EditTimeEntryDialog} from "@/components/dialogs/timetracking/EditTimeEntryDialog";

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

    const [focusEntry, setFocusEntry] = useState<TimeEntry | null>(null);

    if (!timeEntries) return null;

    return (
        <>
            {focusEntry &&
                <EditTimeEntryDialog timeEntry={focusEntry}/>
            }

            <div className={"w-full h-full grid grid-cols-7 rounded-t-lg border border-edge border-b-0"}>
                {days.map((day, index) => (
                    <div key={index}
                         className={cn("h-full bg-black rounded-lg border-x border-edge",
                             day.name === "Sunday" ? "border-x-0 rounded-l-none" : "border-l-0 rounded-r-none"
                         )}
                    >
                        <div className={"w-full border-b border-edge p-3"}>
                            <span className={"text-marcador text-sm font-medium"}>{day.name}</span>
                        </div>
                        <div className={"h-[full] space-y-2"}>
                            {timeEntries.map((entry, index) => {
                                const startDate = new Date(entry.startDate);
                                const endDate = new Date(entry.endDate);

                                return startDate.getDay() === day.day.getDay() && (
                                    <div className={"flex flex-col rounded-lg bg-dark hover:bg-dark-light m-1 cursor-pointer space-y-1 overflow-hidden"}
                                         key={index}
                                         onClick={() => setFocusEntry(entry)}
                                    >
                                        <div className={"flex flex-row space-x-2 items-center pb-1 pt-2 px-2"}>
                                            <Clock7 size={16}/>
                                            <span className={"text-sm"}>{formatTime(startDate) + " - " + formatTime(endDate)}</span>
                                        </div>
                                        <div className={"flex flex-col space-y-1 p-1 border-t border-edge"}>
                                            {entry.project &&
                                                <ProjectBadge title={entry.project.name}
                                                              className={"max-w-48"}
                                                              textClassName={"truncate"}
                                                />
                                            }
                                            {entry.task &&
                                                <EntryTitleBadge title={entry.task.name}
                                                                 className={"max-w-48"}
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
        </>
    );
}