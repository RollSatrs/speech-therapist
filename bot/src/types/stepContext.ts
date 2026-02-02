import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Client } from "whatsapp-web.js";
import { SessionType } from "../interface/interface.sessions";

export interface StepContext{
    client: Client
    db: NodePgDatabase
    chatId: string
    rawText: string
    text: string
    s: SessionType
}

export type StepHandler = (ctx: StepContext) => Promise<void>