import pkg from 'whatsapp-web.js';
import QRCode from 'qrcode';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { askParentNameEn, askParentNameKz, askParentNameRu, languageText, welcomeEn, welcomeKz, welcomeRu } from './const/constante.text';
import { session } from './const/sesion';

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
  const text = msg.body.toLowerCase();
  if(!session[chatId]){
    
  }
  if (text === 'старт') await client.sendMessage(chatId, languageText, { sendSeen: false });

  if (text === 'русский') await client.sendMessage(chatId, welcomeRu, { sendSeen: false });
  if (text === 'қазақша') await client.sendMessage(chatId, welcomeKz, { sendSeen: false });
  if (text === 'english') await client.sendMessage(chatId, welcomeEn, { sendSeen: false });

  if (text === 'начать тест') await client.sendMessage(chatId, askParentNameRu, { sendSeen: false });
  if (text === 'тесті бастау') await client.sendMessage(chatId, askParentNameKz, { sendSeen: false });
  if (text === 'start test') await client.sendMessage(chatId, askParentNameEn, { sendSeen: false });

});

client.initialize();