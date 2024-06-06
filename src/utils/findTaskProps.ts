import {Project, Task, Team, User} from "@/types/types";

interface PropsContextType {
    task?: Task;
    team?: Team | undefined;
    project?: Project | undefined;
}


export const findTaskProps = (user: User | undefined, taskId: number): PropsContextType => {
    if (!user) throw new Error('Cant find task props');
    for (const team of user.teams) {
        for (const project of team.projects) {
            const task = project.tasks.find(t => t.id === taskId);
            if (task) {
                return { task, team, project };
            }
        }
    }
    return { task: {} as Task, team: {} as Team, project: {} as Project };
}