"use client";

import React from "react";
import {SignalHigh, SignalLow, SignalMedium} from "lucide-react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    priority: string | null;
}

export const PriorityBadge: React.FC<Props> = ({ priority, className, ...props }) => {
    if (!priority) return null;

    return (
        <div {...props}>
            {priority === "LOW" && <SignalLow strokeWidth={3} size={16} className={className}/>}
            {priority === 'MEDIUM' && <SignalMedium strokeWidth={3} size={16} className={className}/>}
            {priority === 'HIGH' && <SignalHigh strokeWidth={3} size={16} className={className}/>}
        </div>
    )
}