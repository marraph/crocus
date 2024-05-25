import {ChevronDown, ChevronUp} from "lucide-react";


export function Caret({ direction }: { direction: "asc" | "desc" }) {
    return (
        direction === "desc" ?
            <ChevronUp size={16} strokeWidth={3} className={"ml-1"}/> :
            <ChevronDown size={16} strokeWidth={3} className={"ml-1"}/>
    );
}