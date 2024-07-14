import React from "react";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {TreePalm} from "lucide-react";

interface Props extends React.HTMLAttributes<HTMLDivElement>{
    title: string;
}

export const AbsenceBadge: React.FC<Props> = ({ title, className, ...props }) => {
    if (!title) return null;

    return (
        <Badge
            text={title}
            className={"bg-marcador bg-opacity-20 text-white rounded-md font-normal px-3 text-xs"}
            {...props}>
            <TreePalm size={16}/>
        </Badge>
    );
}