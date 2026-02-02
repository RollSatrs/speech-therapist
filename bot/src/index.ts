import pkg from 'whatsapp-web.js';
import QRCode from 'qrcode';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { session, StepsUpdate } from './const/sesion';
import { errLanguageText, invalidPhoneKz, invalidPhoneRu, languageText, menuKz, menuRu, noChildProfileKz, noChildProfileRu } from './const/constante.text';
import { isValidPhone, normalizePhone } from './tools/tools';
import { eq } from 'drizzle-orm';
import { stepHandlers } from './steps/main';
import { answersTable, childrenTable, parentsTable, questionsTable, sessionsTable, sessonAnswerTable, testsTable } from './db/schema';

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

client.on('authenticated', () => {
  console.log('✅ WhatsApp бот готов!');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Ошибка авторизации:', msg);
});

client.on('ready', () => {
  console.log('✅ WhatsApp Web полностью загружен');
});

client.on('disconnected', (reason) => {
  console.warn('⚠️ WhatsApp отключился:', reason);
});

client.on('change_state', (state) => {
  console.log('ℹ️ Состояние клиента:', state);
});

client.on('message', async (msg) => {
  const chatId = msg.from;
  const rawText = msg.body
  const text = rawText.toLowerCase();

  if (text === 'очистить') {
    await db.delete(sessonAnswerTable);
    await db.delete(sessionsTable);
    await db.delete(answersTable);
    await db.delete(questionsTable);
    await db.delete(testsTable);
    await db.delete(childrenTable);
    await db.delete(parentsTable);
    delete session[chatId];
    await client.sendMessage(chatId, 'База данных очищена.', { sendSeen: false });
    return;
  }

  session[chatId] ??= {
    step: StepsUpdate.idle,
    meta: {},
    data: {
      parent: { fullname: '', phone: '' },
      child: {fullname: '', age: '', language: ''}, // ← добавить
    },
  };  
  const s = session[chatId]
  const handler = stepHandlers[s.step]
  if(!handler) return
  await handler({client, db, chatId, rawText, text, s})
});

client.initialize();
