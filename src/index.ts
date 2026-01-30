import pkg from 'whatsapp-web.js';
import QRCode from 'qrcode';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { session, StepsUpdate } from './const/sesion';
import { errLanguageText, invalidPhoneKz, invalidPhoneRu, languageText, menuKz, menuRu, noChildProfileKz, noChildProfileRu } from './const/constante.text';
import { isValidPhone, normalizePhone } from './tools/tools';
import { childrenTable, parentsTable } from './db/schema';
import { eq } from 'drizzle-orm';
import { stepHandlers } from './steps/main';

const { Client, LocalAuth } = pkg;

const db = drizzle(process.env.DATABASE_URL!);

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

client.on('qr', async (qr: string) => {
  console.log('QR получен, отсканируйте в WhatsApp:');
  try {
    const qrTerminal = await QRCode.toString(qr, { type: 'terminal', small: true });
    console.log(qrTerminal);
  } catch (err) {
    console.error('Ошибка при генерации QR:', err);
  }
});

client.on('ready', () => {
  console.log('✅ WhatsApp бот готов!');
});

client.on('message', async (msg) => {
  const chatId = msg.from;
  const rawText = msg.body
  const text = rawText.toLowerCase();

  session[chatId] ??= { step: StepsUpdate.idle, meta: {}, data: {} };
  const s = session[chatId]
  const langData = s.meta.language
  const handler = stepHandlers[s.step]
  if(!handler) return
  await handler({client, db, chatId, rawText, text, s})



});

client.initialize();