import React, {useCallback, useState} from "react";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {CalendarSearch} from "lucide-react";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {RegionChart} from "@marraph/daisy/components/regionchart/RegionChart";

const data = [
    { day: 5, tasks: 100 },
    { day: 10, tasks: 70 },
    { day: 15, tasks: 120 },
    { day: 20, tasks: 150 },
    { day: 25, tasks: 45 },
    { day: 30, tasks: 80 },
];

export const TasksGraphCard = () => {
    const [selectedRange, setSelectedRange] = useState<string | null>("Last 7 days");

    const calculateData = useCallback(() => {
        switch (selectedRange) {
            case "Last 7 days":
                return data.slice(0, 7);
            case "Last 30 days":
                return data.slice(0, 30);
            case "Last 365 days":
                return data;
            default:
                return data;
        }
    }, [selectedRange]);

    return (
        <div className={"flex-grow h-80 flex flex-col rounded-lg border border-zinc-300 dark:border-edge mb-4"}>
            <div className={"flex flex-row items-center justify-between p-4 bg-zinc-200 dark:bg-dark rounded-t-lg"}>
                <span>{"Task's completed"}</span>
                <Combobox buttonTitle={"Select a range"}
                          preSelectedValue={selectedRange}
                          icon={<CalendarSearch size={16} className={"mr-2"}/>}
                          getItemTitle={(item) => item as string}
                          onValueChange={(value) => setSelectedRange(value as string || null)}
                >
                    <ComboboxItem title={"Last 7 days"} value={"Last 7 days"}/>
                    <ComboboxItem title={"Last 30 days"} value={"Last 30 days"}/>
                    <ComboboxItem title={"Last 365 days"} value={"Last 365 days"}/>
                </Combobox>
            </div>
            <Seperator/>
            <div className={"h-full w-full p-4"}>
                <RegionChart data={data}
                             type={"linear"}
                             xAxis_dataKey={"day"}
                             yAxis_dataKey={"tasks"}
                             gradient={true}
                />
            </div>
        </div>
    );
}