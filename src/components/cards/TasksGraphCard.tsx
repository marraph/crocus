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
    const [selectedRange, setSelectedRange] = useState<string | null>("Last 7d");

    const calculateData = useCallback(() => {
        switch (selectedRange) {
            case "Last 7d":
                return data.slice(0, 7);
            case "Last 30d":
                return data.slice(0, 30);
            case "Last 365d":
                return data;
            default:
                return data;
        }
    }, [selectedRange]);

    return (
        <div className={"flex-grow h-80 flex flex-col rounded-lg border border-edge mx-4 mb-4"}>
            <div className={"flex flex-row items-center justify-between p-4 bg-dark rounded-lg"}>
                <span>Task's completed</span>
                <Combobox buttonTitle={"Select a range"}
                          preSelectedValue={"Last 7d"}
                          icon={<CalendarSearch size={16} className={"mr-2"}/>}
                          onValueChange={(value) => setSelectedRange(value)}
                >
                    <ComboboxItem title={"Last 7 d"}/>
                    <ComboboxItem title={"Last 30d"}/>
                    <ComboboxItem title={"Last 365d"}/>
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