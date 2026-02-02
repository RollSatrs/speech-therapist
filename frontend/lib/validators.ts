import { z } from "zod";

export const answerSchema = z.object({
  id: z.number().optional(),
  textRu: z.string().min(1),
  textKz: z.string().min(1),
  textEn: z.string().optional(),
  points: z.number().min(0).max(10),
});

export const questionSchema = z.object({
  id: z.number().optional(),
  textRu: z.string().min(1),
  textKz: z.string().min(1),
  textEn: z.string().optional(),
  answers: z.array(answerSchema).min(2),
});

export const testSchema = z.object({
  name: z.string().min(1),
  ageFrom: z.number().min(1).max(18),
  ageTo: z.number().min(1).max(18),
  questions: z.array(questionSchema).min(1),
});

export type TestPayload = z.infer<typeof testSchema>;
