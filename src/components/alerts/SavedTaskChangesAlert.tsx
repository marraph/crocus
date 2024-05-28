import {Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {Save} from "lucide-react";

export function SavedTaskChangesAlert() {
    return (
        <Alert className={"fixed bottom-4 right-4 z-50 border border-white border-opacity-20 bg-dark"}>
            <AlertIcon icon={<Save />}/>
            <AlertContent>
                <AlertTitle title={"Saved changes"}></AlertTitle>
                <AlertDescription description={"You successfully saved your task changes."}></AlertDescription>
            </AlertContent>
        </Alert>
    )
}