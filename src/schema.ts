import {
    boolean,
    doublePrecision,
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp
} from 'drizzle-orm/pg-core';
import {relations} from "drizzle-orm/relations";

/*
    Enums
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

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
})

export const topics = pgTable('topics', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    hexCode: text('hex_code').notNull(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    createdBy: integer('created_by')
        .notNull()
        .references(() => users.id),
    updatedBy: integer('updated_by')
        .notNull()
        .references(() => users.id),
    teamId: integer("team_id")
        .notNull()
        .references(() => teams.id)
})


export const tasks = pgTable('tasks', {
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
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    createdBy: integer('created_by')
        .notNull()
        .references(() => users.id),
    updatedBy: integer('updated_by')
        .notNull()
        .references(() => users.id),
    projectId: integer("project_id")
        .references(() => projects.id)
})

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    priority: priority('priority').default('low'),
    isArchived: boolean('is_archived').default(false),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    createdBy: integer('created_by')
        .notNull()
        .references(() => users.id),
    updatedBy: integer('updated_by')
        .notNull()
        .references(() => users.id),
    teamId: integer("team_id")
        .notNull()
        .references(() => teams.id)
})

export const teams = pgTable("teams", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    createdBy: integer('created_by')
        .notNull()
        .references(() => users.id),
    updatedBy: integer('updated_by')
        .notNull()
        .references(() => users.id),
    organisationId: integer("organisation_id")
        .notNull()
        .references(() => organisations.id)
})

export const organisations = pgTable("organisations", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    createdBy: integer('created_by')
        .notNull()
        .references(() => users.id),
    updatedBy: integer('updated_by')
        .notNull()
        .references(() => users.id),
})

export const absences = pgTable("absences", {
    id: serial('id').primaryKey(),
    comment: text('name'),
    reason: absenceReason("reason").notNull(),
    start: timestamp("start"),
    end: timestamp("end"),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    createdBy: integer('created_by')
        .notNull()
        .references(() => users.id),
})

export const entries = pgTable("entries", {
    id: serial('id').primaryKey(),
    comment: text('comment'),
    start: timestamp("start"),
    end: timestamp("end"),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
    createdBy: integer('created_by')
        .notNull()
        .references(() => users.id),
    projectId: integer('project_id')
        .references(() => projects.id),
    taskId: integer('task_id')
        .references(() => tasks.id)
})

export const teamMembers = pgTable('team_members', {
    createdAt: timestamp('created_at').notNull(),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id),
    teamId: integer('team_id')
        .notNull()
        .references(() => teams.id)
})

export const organisationMembers = pgTable('organisation_members', {
    createdAt: timestamp('created_at').notNull(),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id),
    organisationId: integer('organisation_id')
        .notNull()
        .references(() => organisations.id)
})

/*
    Relations
 */

export const userRelations = relations(users, ({many}) => ({
    organisationMemberships: many(organisationMembers),
    teamMemberships: many(teamMembers),
    absence: many(absences),
    entry: many(entries)
}))

export const organisationRelations = relations(organisations, ({one, many}) => ({
    createdBy: one(users, {
        fields: [organisations.createdBy],
        references: [users.id]
    }),
    updatedBy: one(users, {
        fields: [organisations.updatedBy],
        references: [users.id]
    }),
    team: many(teams),
    members: many(organisationMembers)
}))

export const organisationMemberRelations = relations(organisationMembers, ({one}) => ({
    organisation: one(organisations, {
        fields: [organisationMembers.organisationId],
        references: [organisations.id]
    }),
    user: one(users, {
        fields: [organisationMembers.userId],
        references: [users.id]
    })
}))

export const teamMemberRelations = relations(teamMembers, ({one}) => ({
    team: one(teams, {
        fields: [teamMembers.teamId],
        references: [teams.id]
    }),
    user: one(users, {
        fields: [teamMembers.userId],
        references: [users.id]
    })
}))

export const topicRelations = relations(topics, ({one}) => ({
    team: one(teams, {
        fields: [topics.teamId],
        references: [teams.id]
    }),
    createdBy: one(users, {
        fields: [topics.createdBy],
        references: [users.id]
    }),
    updatedBy: one(users, {
        fields: [topics.updatedBy],
        references: [users.id]
    })
}))

export const teamRelations = relations(teams, ({one, many}) => ({
    organisation: one(organisations, {
        fields: [teams.organisationId],
        references: [organisations.id]
    }),
    createdBy: one(users, {
        fields: [teams.createdBy],
        references: [users.id]
    }),
    updatedBy: one(users, {
        fields: [teams.updatedBy],
        references: [users.id]
    }),
    topic: many(topics),
    project: many(projects),
    members: many(teamMembers)
}))

export const projectRelations = relations(projects, ({one, many}) => ({
    team: one(teams, {
        fields: [projects.teamId],
        references: [teams.id]
    }),
    createdBy: one(users, {
        fields: [projects.createdBy],
        references: [users.id]
    }),
    updatedBy: one(users, {
        fields: [projects.updatedBy],
        references: [users.id]
    }),
    task: many(tasks),
    entry: many(entries)
}))

export const taskRelations = relations(tasks, ({one, many}) => ({
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id]
    }),
    topic: one(topics, {
        fields: [tasks.topic],
        references: [topics.id]
    }),
    createdBy: one(users, {
        fields: [tasks.createdBy],
        references: [users.id]
    }),
    updatedBy: one(users, {
        fields: [tasks.updatedBy],
        references: [users.id]
    }),
    entry: many(entries)
}))


export const absenceRelations = relations(absences, ({one}) => ({
    createdBy: one(users, {
        fields: [absences.createdBy],
        references: [users.id]
    })
}))

export const entryRelations = relations(entries, ({one}) => ({
    project: one(projects, {
        fields: [entries.projectId],
        references: [projects.id]
    }),
    task: one(tasks, {
        fields: [entries.taskId],
        references: [tasks.id]
    }),
    createdBy: one(users, {
        fields: [entries.createdBy],
        references: [users.id]
    })
}))