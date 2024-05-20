"use client";

import React from "react";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {cn} from "@/utils/cn";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    color: string;
}

export const StatusBadge: React.FC<Props> = ({ title, color, className, ...props }) => {
    return (
        <Badge
            text={title}
            className={cn("bg-warning bg-opacity-20 text-warning font-normal rounded-md w-max px-2 py-0.5 text-xs", className)}
            {...props}>
        </Badge>
    )
}