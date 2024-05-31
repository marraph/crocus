import {Filter} from "@marraph/daisy/components/filter/Filter";

const teams = ["Frontend", "Backend", "Design", "Management", "Marketing", "Support"];
const projects = ["ServerAPI", "ClientAPI", "Website", "App", "Database"];
const topics = ["bug", "feature", "task"];
const statuses = ["todo", "in progress", "done"];
const priorities = ["low", "medium", "high"];
const creators = ["mvriu5", "marraph", "johndoe", "janedoe"];


export function FilterContext() {
    return (
        <Filter>

        </Filter>
    );
}