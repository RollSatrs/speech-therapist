import { integer, pgTable, varchar, date, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const childLanguageEnum = pgEnum("child_language", ["russian","kazakh","bilingual"]);

export const parentsTable =  pgTable("parents", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullname: varchar({ length: 255 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const childrenTable = pgTable("children", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullname: varchar({ length: 255 }).notNull(),
  birthDate: date('birth_date').notNull(),
  language: childLanguageEnum("language").notNull(),
  parentId: integer("parent_id").notNull().references(() => parentsTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

}); 

export const testsTable = pgTable("tests", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  ageFrom: integer("age_from").notNull(),
  ageTo: integer("age_to").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const questionsTable = pgTable("questions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  textId: integer('text_id').notNull().references(() => testsTable.id, { onDelete: 'cascade' }),
  textRu: varchar("text_ru", { length: 255 }).notNull(),
  textKz: varchar("text_kz", { length: 255 }).notNull(),
  textEn: varchar("text_en", { length: 255 })
})

export const answersTable = pgTable("answers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  questionId: integer("question_id").notNull().references(() => questionsTable.id, { onDelete: 'cascade' }),
  textRu: varchar("text_ru", { length: 255 }).notNull(),
  textKz: varchar("text_kz", { length: 255 }).notNull(),
  textEn: varchar("text_en", { length: 255 }), 
  points: integer("points").notNull().default(0)
})

export const sessionsTable = pgTable("sessions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  testId: integer('test_id').notNull().references(() => testsTable.id, { onDelete: 'cascade' }),
  parentId: integer('parent_id').notNull().references(() => parentsTable.id, { onDelete: 'cascade' }),
  childrenId: integer('children_id').notNull().references(() => childrenTable.id, { onDelete: 'cascade' }),
  chatId: varchar("chat_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
})

export const sessonAnswerTable = pgTable("sesson_answer", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sessonId: integer('session_id').notNull().references(() => sessionsTable.id, { onDelete: 'cascade' }),
  questionId: integer("question_id").notNull().references(() => questionsTable.id, {onDelete: 'cascade'}),
  answerId: integer('answer_id').notNull().references(() => answersTable.id, {onDelete: 'cascade'}),
  answerText: varchar('answer_text', { length: 255 }).notNull(),  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})