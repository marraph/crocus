"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {AlarmClockPlus, CalendarDays, ChevronLeft, ChevronRight, TreePalm} from "lucide-react";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {CreateTimeEntryDialog} from "@/components/dialogs/timetracking/CreateTimeEntryDialog";
import {TimetrackTable} from "@/components/views/TimetrackTable";
import {useUser} from "@/context/UserContext";
import {CreateAbsenceDialog} from "@/components/dialogs/timetracking/CreateAbsenceDialog";
import {Absence, TimeEntry, User} from "@/types/types";
import {TimeEntryDaySummary} from "@/components/cards/TimeEntryDaySummary";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {WeekView} from "@/components/views/WeekView";
import {SwitchButton} from "@marraph/daisy/components/switchbutton/SwitchButton";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";
import moment from "moment";

export interface Week {
    monday: Date;
    tuesday: Date;
    wednesday: Date;
    thursday: Date;
    friday: Date;
    saturday: Date;
    sunday: Date;
}


function createWeek(weekStart: moment.Moment): Week {
    return {
        monday: weekStart.toDate(),
        tuesday: weekStart.clone().add(1, 'days').toDate(),
        wednesday: weekStart.clone().add(2, 'days').toDate(),
        thursday: weekStart.clone().add(3, 'days').toDate(),
        friday: weekStart.clone().add(4, 'days').toDate(),
        saturday: weekStart.clone().add(5, 'days').toDate(),
        sunday: weekStart.clone().add(6, 'days').toDate()
    };
}

function generateWeeks(): Week[] {
    let weeksArray: Week[] = [];
    let currentWeek = moment().startOf('week').add(1, 'days');

    for (let i = 20; i > 0; i--) {
        let weekStart = currentWeek.clone().subtract(i, 'weeks');
        weeksArray.push(createWeek(weekStart));
    }

    weeksArray.push(createWeek(currentWeek));

    for (let i = 1; i <= 20; i++) {
        let weekStart = currentWeek.clone().add(i, 'weeks');
        weeksArray.push(createWeek(weekStart));
    }

    return weeksArray;
}

function findCurrentWeek(weeksArray: Week[]): Week {
    const today = moment().startOf('day');
    return weeksArray.find(week => {
        const monday = moment(week.monday);
        const sunday = moment(week.sunday);
        return today.isBetween(monday, sunday, null, '[]');
    }) as Week;
}

function getFilterDayEntries(user: User | undefined, day: Date): TimeEntry[] | undefined {
    return user?.timeEntries?.filter(entry => {
        const startDate = moment(entry.startDate);
        return startDate.toDate() === day;
    });
}

function getFilterDayAbsences(user: User | undefined, day: Date): Absence[] | undefined {
    return user?.absences?.filter(absence => {
        const startDate = moment(absence.startDate);
        return startDate.toDate() === day;
    });
}

function getFilterWeekEntries(user: User | undefined, week: Week): TimeEntry[] | undefined {
    return user?.timeEntries?.filter(entry => {
        const startDate = moment(entry.startDate).toDate();
        const monday = moment(week.monday).toDate();
        const sunday = moment(week.sunday).toDate();
        return startDate >= monday && startDate <= sunday;
    });
}

function getFilterWeekAbsences(user: User | undefined, week: Week): Absence[] | undefined {
    return user?.absences?.filter(absence => {
        const startDate = moment(absence.startDate).toDate();
        const monday = moment(week.monday).toDate();
        const sunday = moment(week.sunday).toDate();
        return startDate >= monday && startDate <= sunday;
    });
}

export default function Timetracking() {
    const datepickerRef = useRef<DatepickerRef>(null);
    const comboboxRef = useRef<ComboboxRef>(null);
    const entryDialogRef = useRef<DialogRef>(null);
    const absenceDialogRef = useRef<DialogRef>(null);

    const weeks = useMemo(() => generateWeeks(), []);
    const [day, setDay] = useState<Date>(moment().toDate());
    const [week, setWeek] = useState<Week>(findCurrentWeek(weeks));
    const [view, setView] = useState<boolean>(false);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    const [dailyEntries, setDailyEntries] = useState<TimeEntry[] | undefined>(getFilterDayEntries(user, day));
    const [weekEntries, setWeekEntries] = useState<TimeEntry[] | undefined>(getFilterWeekEntries(user, week));
    const [dailyAbsences, setDailyAbsences] = useState<Absence[] | undefined>(getFilterDayAbsences(user, day));
    const [weekAbsences, setWeekAbsences] = useState<Absence[] | undefined>(getFilterWeekAbsences(user, week));

    useEffect(() => {
        if (user?.timeEntries) setDailyEntries(getFilterDayEntries(user, day));
        if (user?.timeEntries) setWeekEntries(getFilterWeekEntries(user, week));
        if (user?.absences) setDailyAbsences(getFilterDayAbsences(user, day));
        if (user?.absences) setWeekAbsences(getFilterWeekAbsences(user, week));

    }, [user, day, week, user?.timeEntries, user?.absences]);

    if (!user) return null;

    const handleDayBefore = () => {
        setDay(moment(day).subtract(1, 'days').toDate());
        datepickerRef.current?.setValue(moment(day).subtract(1, 'days').toDate());
    }

    const handleDayAfter = () => {
        setDay(moment(day).add(1, 'days').toDate());
        datepickerRef.current?.setValue(moment(day).add(1, 'days').toDate());
    }

    const handleWeekBefore = () => {
        setWeek(weeks[weeks.indexOf(week) - 1]);
        comboboxRef.current?.setValue(
            moment(weeks[weeks.indexOf(week) - 1].monday).format("Do MMMM YYYY") + "  -  " +
            moment(weeks[weeks.indexOf(week) - 1].sunday).format("Do MMMM YYYY")
        );
    }

    const handleWeekAfter = () => {
        setWeek(weeks[weeks.indexOf(week) + 1]);
        comboboxRef.current?.setValue(
            moment(weeks[weeks.indexOf(week) + 1].monday).format("Do MMMM YYYY") + "  -  " +
            moment(weeks[weeks.indexOf(week) + 1].sunday).format("Do MMMM YYYY")
        );
    }

    return (
        <>
            <div className={"h-screen flex flex-col p-8"}>
                <div className={"text-nowrap flex flex-row items-center justify-between"}>
                    <div className={"w-full flex flex-row items-center space-x-2"}>
                        <Button text={""}
                                onClick={view ? handleDayBefore : handleWeekBefore}
                                icon={<ChevronLeft size={20}/>}
                        />
                        <Button text={""}
                                onClick={view ? handleDayAfter: handleWeekAfter}
                                icon={<ChevronRight size={20}/>}
                        />
                        {view ?
                            <DatePicker text={"Select a Date"}
                                        size={"medium"}
                                        preSelectedValue={day}
                                        ref={datepickerRef}
                                        closeButton={false}
                                        onValueChange={(day) => day ? setDay(day) : setDay(new Date())}
                                        dayFormat={"long"}
                            />
                        :
                            <Combobox buttonTitle={"Week"}
                                      icon={<CalendarDays size={16} className={"mr-2"}/>}
                                      ref={comboboxRef}
                                      preSelectedValue={moment(week.monday).format("Do MMMM YYYY") + "  -  " + moment(week.sunday).format("Do MMMM YYYY")}
                                      onValueChange={(week) => setWeek(weeks.find((w) =>
                                          moment(w.monday).format("Do MMMM YYYY") + "  -  " + moment(w.sunday).format("Do MMMM YYYY") === week) as Week)}
                            >
                                {weeks.map((week, index) => (
                                    <ComboboxItem key={index}
                                                  title={moment(week.monday).format("Do MMMM YYYY") + "  -  " + moment(week.sunday).format("Do MMMM YYYY")}
                                    />
                                ))}
                            </Combobox>
                        }
                    </div>
                    <div className={"flex flex-row justify-end space-x-2"}>
                        <SwitchButton firstTitle={"Day"}
                                      secondTitle={"Week"}
                                      onClick={() => setView(!view)}
                        />
                        <Button text={"New Absence"}
                                theme={"dark"}
                                onClick={() => absenceDialogRef.current?.show()}
                                icon={<TreePalm size={20} className={"mr-2"}/>}
                        />
                        <Button text={"New Entry"}
                                theme={"white"}
                                onClick={() => entryDialogRef.current?.show()}
                                icon={<AlarmClockPlus size={20} className={"mr-2"}/>}
                        />
                    </div>
                </div>

                    <div className={"w-full h-screen rounded-lg flex flex-col items-stretch pt-4"}>
                        {view ?
                            <>
                                <TimetrackTable entries={dailyEntries} absences={dailyAbsences}/>
                                <div className={"flex-grow bg-black border border-y-0 border-edge"}></div>
                                <TimeEntryDaySummary entries={dailyEntries}/>
                            </>
                        :
                            <>
                                <WeekView timeEntries={weekEntries} absences={weekAbsences} week={week}/>
                                <TimeEntryDaySummary entries={weekEntries}/>
                            </>
                        }
                    </div>
            </div>

            <CreateAbsenceDialog ref={absenceDialogRef}/>
            <CreateTimeEntryDialog ref={entryDialogRef}/>
        </>
    );
}