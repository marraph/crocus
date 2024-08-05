import {boolean, doublePrecision, integer, pgEnum, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";

/*
    Data-Structs
 */

export const priority = pgEnum("priority", [
    'low',
    'medium',
    'high'
])

export const state = pgEnum("state", [
    'pending',
    'planing',
    'started',
    'tested',
    'finished'
])

export const user = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at")
})

export const topic = pgTable("topics", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    hexCode: text("hex_code").notNull()
})

export const task = pgTable("tasks", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    topicId: integer("topic_id").references(() => topic.id),
    isArchived: boolean("is_archived").default(false),
    duration: doublePrecision("duration").default(0),
    bookedDuration: doublePrecision("booked_duration").default(0),
    deadline: timestamp("deadline"),
    state: state("state").default('planing'),
    priority: priority("priority").default('low')

})