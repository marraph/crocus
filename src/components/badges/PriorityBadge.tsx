"use client";

import React from "react";
import {SignalHigh, SignalLow, SignalMedium} from "lucide-react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    priority?: string;
}

export const PriorityBadge: React.FC<Props> = ({ priority }) => {
    if (!priority) return null;

    return (
        <>
            {priority === "LOW" && <SignalLow strokeWidth={3} />}
            {priority === 'MEDIUM' && <SignalMedium strokeWidth={3} />}
            {priority === 'HIGH' && <SignalHigh strokeWidth={3} />}
        </>
    )
}