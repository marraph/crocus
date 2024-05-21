import {MoveDown, MoveUp} from "lucide-react";


export function Caret({ direction }: { direction: "asc" | "desc" }) {
    return (
        direction === "desc" ? <MoveUp /> : <MoveDown />
    );
}