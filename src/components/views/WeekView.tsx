import {Absence, TimeEntry} from "@/types/types";
import React, {useMemo, useRef, useState} from "react";
import {ProjectBadge} from "@/components/badges/ProjectBadge";
import {EntryTitleBadge} from "@/components/badges/EntryTaskBadge";
import {cn} from "@/utils/cn";
import {Week} from "@/app/timetracking/page";
import {Clock7} from "lucide-react";
import {EditTimeEntryDialog} from "@/components/dialogs/timetracking/EditTimeEntryDialog";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import moment from "moment";

interface TimeEntryProps {
    timeEntries: TimeEntry[] | undefined;
    absences: Absence[] | undefined;
    week: Week;
}

export const WeekView: React.FC<TimeEntryProps> = ({ week, timeEntries }) => {
    const editRef = useRef<DialogRef>(null);
    const [focusEntry, setFocusEntry] = useState<TimeEntry | null>(null);
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
        <>
            {focusEntry &&
                <EditTimeEntryDialog timeEntry={focusEntry} ref={editRef}/>
            }

            <div className={"w-full h-full grid grid-cols-7 rounded-t-lg border border-edge border-b-0 overflow-hidden"}>
                {days.map((day, index) => (
                    <div key={index}
                         className={cn("h-full bg-black-light rounded-lg border-x border-edge",
                             day.name === "Sunday" ? "border-x-0 rounded-l-none" : "border-l-0 rounded-r-none"
                         )}
                    >
                        <div className={"w-full border-b border-edge p-3 bg-dark"}>
                            <span className={"text-marcador text-sm font-medium"}>{day.name}</span>
                        </div>
                        <div className={"h-[full] space-y-2"}>
                            {timeEntries.map((entry, index) => {
                                const startDate = new Date(entry.startDate);
                                const endDate = new Date(entry.endDate);

                                return startDate.getDay() === day.day.getDay() && (
                                    <div className={"flex flex-col rounded-lg bg-dark-light hover:bg-dark-light m-1 cursor-pointer space-y-1 overflow-hidden"}
                                         key={index}
                                         onClick={() => {
                                             setFocusEntry(entry);
                                             editRef.current?.show();
                                         }}
                                    >
                                        <div className={"flex flex-row space-x-2 items-center pb-1 pt-2 px-2"}>
                                            <Clock7 size={16}/>
                                            <span className={"text-sm"}>{moment(startDate).format('HH:mm') + " - " + moment(endDate).format('HH:mm')}</span>
                                        </div>
                                        <div className={"flex flex-col space-y-1 p-1 border-t border-edge"}>
                                            {entry.project &&
                                                <ProjectBadge title={entry.project.name}
                                                              className={"max-w-[99%]"}
                                                              textClassName={"truncate"}
                                                />
                                            }
                                            {entry.task &&
                                                <EntryTitleBadge title={entry.task.name}
                                                                 className={"max-w-[99%]"}
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