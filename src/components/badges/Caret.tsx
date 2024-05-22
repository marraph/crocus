import {MoveDown, MoveUp} from "lucide-react";


export function Caret({ direction }: { direction: "asc" | "desc" }) {
    return (
        direction === "desc" ? <MoveUp size={15}/> : <MoveDown size={15}/>
    );
}