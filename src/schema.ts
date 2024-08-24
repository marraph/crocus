import {boolean, doublePrecision, integer, pgEnum, pgTable, serial, text, timestamp} from 'drizzle-orm/pg-core';
import {relations} from "drizzle-orm/relations";

/*
    Data
 */

export const priority = pgEnum('priority', [
    'low',
    'medium',
    'high'
])

export const state = pgEnum('state', [
    'pending',
    'planing',
    'started',
    'tested',
    'finished'
])

export const absenceReason = pgEnum('absence_reason', [
    'sick',
    'vacation'
])

/*
    Objects
 */

export const user = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    password: text('password'),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
})

export const topic = pgTable('topics', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    hexCode: text('hex_code').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
    createdBy: integer('created_by')
        .notNull()
        .references(() => user.id),
    updatedBy: integer('updated_by')
        .notNull()
        .references(() => user.id),
    teamId: integer("team_id")
        .notNull()
        .references(() => team.id)
})


export const task = pgTable('tasks', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    isArchived: boolean('is_archived').default(false),
    duration: doublePrecision('duration').default(0),
    bookedDuration: doublePrecision('booked_duration').default(0),
    deadline: timestamp('deadline'),
    topic: integer('topic_id'),
    state: state('state').default('planing'),
    priority: priority('priority').default('low'),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
    createdBy: integer('created_by')
        .notNull()
        .references(() => user.id),
    updatedBy: integer('updated_by')
        .notNull()
        .references(() => user.id),
    projectId: integer("project_id")
        .references(() => project.id)
})

export const project = pgTable('projects', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    priority: priority('priority').default('low'),
    isArchived: boolean('is_archived').default(false),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
    createdBy: integer('created_by')
        .notNull()
        .references(() => user.id),
    updatedBy: integer('updated_by')
        .notNull()
        .references(() => user.id),
    teamId: integer("team_id")
        .notNull()
        .references(() => team.id)
})

export const team = pgTable("teams", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
    createdBy: integer('created_by')
        .notNull()
        .references(() => user.id),
    updatedBy: integer('updated_by')
        .notNull()
        .references(() => user.id),
    organisationId: integer("organisation_id")
        .notNull()
        .references(() => organisation.id)
})

export const organisation = pgTable("organisations", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
    createdBy: integer('created_by')
        .notNull()
        .references(() => user.id),
    updatedBy: integer('updated_by')
        .notNull()
        .references(() => user.id),
})

export const absence = pgTable("absences", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    reason: absenceReason("reason").notNull(),
    start: timestamp("start"),
    end: timestamp("end"),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
    createdBy: integer('created_by')
        .notNull()
        .references(() => user.id),
    updatedBy: integer('updated_by')
        .notNull()
        .references(() => user.id),
})

export const entry = pgTable("entries", {
    id: serial('id').primaryKey(),
    comment: text('comment').notNull(),
    start: timestamp("start"),
    end: timestamp("end"),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
    createdBy: integer('created_by')
        .notNull()
        .references(() => user.id),
    updatedBy: integer('updated_by')
        .notNull()
        .references(() => user.id),
    projectId: integer('project_id')
        .references(() => project.id),
    taskId: integer('task_id')
        .references(() => task.id)
})

export const members = pgTable('members', {
    createdAt: timestamp('created_at'),
    userId: integer('user_id')
        .notNull()
        .references(() => user.id),
    teamId: integer('team_id')
        .notNull()
        .references(() => team.id)
})

/*
    Relations
 */

export const organisationRelation = relations(organisation, ({many}) => ({
    teams: many(team)
}))

export const teamRelation = relations(team, ({one, many}) => ({
    organisation: one(organisation, {
        fields: [team.organisationId],
        references: [organisation.id]
    }),
    topics: many(topic),
    projects: many(project),
    users: many(user)
}))

export const projectRelation = relations(project, ({one, many}) => ({
    team: one(team, {
        fields: [project.teamId],
        references: [team.id]
    }),
    tasks: many(task)
}))

export const taskRelation = relations(task, ({one}) => ({
    project: one(project, {
        fields: [task.projectId],
        references: [project.id]
    })
}))