import {Absence, TimeEntry} from "@/types/types";
import React, {useRef, useState} from "react";
import {Week} from "@/app/timetracking/page";
import {Clock} from "lucide-react";
import {EditTimeEntryDialog} from "@/components/dialogs/timetracking/EditTimeEntryDialog";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import moment from "moment";
import { ProjectBadge } from "../badges/ProjectBadge";
import {EntryTaskBadge} from "@/components/badges/EntryTaskBadge";
import {cn} from "@/utils/cn";
import {TimeEntryDaySummary} from "@/components/cards/TimeEntryDaySummary";
import {CustomScroll} from "react-custom-scroll";

interface TimeEntryProps {
    timeEntries: TimeEntry[] | undefined;
    absences: Absence[] | undefined;
    week: Week;
}

export const WeekView: React.FC<TimeEntryProps> = ({ week, timeEntries }) => {
    const editRef = useRef<DialogRef>(null);

    const [focusEntry, setFocusEntry] = useState<TimeEntry | null>(null);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({
        name: day,
        date: moment().day(day)
    }));

    if (!timeEntries) return null;

    const renderTimeEntry = (entry: TimeEntry, index: number) => {
        const startDate = moment(entry.startDate);
        const endDate = moment(entry.endDate);

        return (
            <div className={"flex flex-col rounded-lg bg-dark-light m-1 cursor-pointer space-y-1"}
                 key={index}
                 onClick={() => setFocusEntry(entry)}
            >
                <div className={"flex flex-row space-x-2 items-center pb-1 pt-2 px-2"}>
                    <Clock size={16}/>
                    <span className={"text-sm"}>
                        {startDate.format('HH:mm') + " - " + endDate.format('HH:mm')}
                    </span>
                </div>
                <div className={"flex flex-col space-y-1 p-1 border-t border-edge"}>
                    {entry.project &&
                        <ProjectBadge
                            title={entry.project.name}
                            className={"max-w-[99%]"}
                            textClassName={"truncate"}
                        />
                    }
                    {entry.task &&
                        <EntryTaskBadge
                            title={entry.task.name}
                            className={"max-w-[99%]"}
                            textClassName={"truncate"}
                        />
                    }
                    <span className={"text-sm text-gray-400"}>{entry.comment}</span>
                </div>
            </div>
        );
    };

    return (
        <>
            {focusEntry &&
                <EditTimeEntryDialog timeEntry={focusEntry} ref={editRef}/>
            }

            <div className={"h-full flex flex-col bg-black-light text-white rounded-lg"}>
                <div className={"flex-grow grid grid-cols-7 rounded-t-lg border-x border-t border-edge overflow-hidden"}>
                    {days.map((day, index) => (
                        <div key={index} className={"h-full border-r border-edge last:border-r-0"}>
                            <div className={cn("sticky top-0 bg-dark border-b border-edge p-2",
                                {"rounded-tl-lg": day.name === "Monday"},
                                {"rounded-tr-lg": day.name === "Sunday"})}
                            >
                                <span className={"text-gray text-sm font-normal"}>{day.name}</span>
                            </div>
                            <CustomScroll>
                                <div className={"h-[712px] flex flex-col space-y-2"}>
                                    {timeEntries.filter(entry => moment(entry.startDate).day() === day.date.day())
                                        .map((entry, index) => renderTimeEntry(entry, index))
                                    }
                                </div>
                            </CustomScroll>
                        </div>
                    ))}
                </div>
                <TimeEntryDaySummary entries={timeEntries}/>
            </div>
        </>
    );
}