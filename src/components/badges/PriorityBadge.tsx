"use client";

import React from "react";
import {SignalHigh, SignalLow, SignalMedium} from "lucide-react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    priority: string | null;
}

export const PriorityBadge: React.FC<Props> = ({ priority, className }) => {
    if (!priority) return null;

    return (
        <>
            {priority === "LOW" && <SignalLow strokeWidth={3} className={className}/>}
            {priority === 'MEDIUM' && <SignalMedium strokeWidth={3} className={className}/>}
            {priority === 'HIGH' && <SignalHigh strokeWidth={3} className={className}/>}
        </>
    )
}