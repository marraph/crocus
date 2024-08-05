import {boolean, doublePrecision, pgEnum, pgTable, serial, text, timestamp} from 'drizzle-orm/pg-core';

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
    hexCode: text('hex_code').notNull()
})

export const task = pgTable('tasks', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    isArchived: boolean('is_archived').default(false),
    duration: doublePrecision('duration').default(0),
    bookedDuration: doublePrecision('booked_duration').default(0),
    deadline: timestamp('deadline'),
    state: state('state').default('planing'),
    priority: priority('priority').default('low')
})

export const project = pgTable('projects', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    priority: priority('priority').default('low'),
    isArchived: boolean('is_archived').default(false)
})

export const team = pgTable("teams", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
})

export const organisation = pgTable("organisations", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
})

export const absence = pgTable("absences", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    reason: absenceReason("reason").notNull(),
    start: timestamp("start"),
    end: timestamp("end")
})

export const entry = pgTable("entries", {
    id: serial('id').primaryKey(),
    comment: text('comment').notNull(),
    start: timestamp("start"),
    end: timestamp("end")
})

//TODO: create relations & audit