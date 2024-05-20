"use client";

import React from "react";
import {SignalHigh, SignalLow, SignalMedium} from "lucide-react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    priority: string;
}

export const PriorityBadge: React.FC<Props> = ({ priority }) => {
    return (
        <>
            {priority === "low" && <SignalLow strokeWidth={3} />}
            {priority === 'medium' && <SignalMedium strokeWidth={3} />}
            {priority === 'high' && <SignalHigh strokeWidth={3} />}
        </>
    )
}