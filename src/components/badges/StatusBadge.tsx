"use client";

import React from "react";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {cn} from "@/utils/cn";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    color: string;
}

export const StatusBadge: React.FC<Props> = ({ title, className, ...props }) => {
    if (!title) return null;

    const getColor = (title: string): string => {
        let color;
        switch (title) {
            case "PENDING":
                color = "topicBlue";
                break;
            case "PLANING":
                color = "topicRed";
                break;
            case "STARTED":
                color = "topicOrange";
                break;
            case "TESTED":
                color = "topicYellow";
                break;
            case "FINISHED":
                color = "topicPurple";
                break;
            default:
                color = "Unknown color";
                break;
        }
        return color;
    }

    console.log(getColor(title), title);
    const color = getColor(title);


    return (
        <Badge
            text={title}
            className={cn(`bg-${color} bg-opacity-20 text-${color} font-mono font-normal rounded-md w-max px-2 py-0.5`, className)}
            {...props}>
        </Badge>
    )
}