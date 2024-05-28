import {Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {CheckCheck} from "lucide-react";

export function TaskClosedAlert() {
    return (
        <Alert className={"fixed bottom-4 right-4 z-50 border border-white border-opacity-20 bg-dark"}>
            <AlertIcon icon={<CheckCheck />}/>
            <AlertContent>
                <AlertTitle title={"Task closed successfully!"}></AlertTitle>
                <AlertDescription description={"You can no longer interact with this task."}></AlertDescription>
            </AlertContent>
        </Alert>
    )
}