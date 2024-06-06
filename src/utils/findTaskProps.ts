import {User, TaskElement} from "@/types/types";

interface PropsContextType {
    taskElement: TaskElement;
}


export const findTaskProps = (user: User | undefined, taskId: number): PropsContextType => {
    if (!user) throw new Error('Cant find task props');

    for (const team of user.teams) {
        for (const project of team.projects) {
            const task = project.tasks.find(t => t.id === taskId);
            if (task) {
                return { taskElement: { task, team, project }};
            }
        }
    }
    return { taskElement: {} as TaskElement};
}