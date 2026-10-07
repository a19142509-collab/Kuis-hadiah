const axios = require('axios');

const BOT_TOKEN = '8949074961:AAEeAix4NznerOzw92wovcWF_qjmFwHPa48';
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const WEB_URL = 'https://onecompiler.com/html';

const mainKeyboard = {
  keyboard: [
    [{ text: '🎯 Main Kuis' }, { text: '💰 Cek Saldo' }],
    [{ text: '📜 Riwayat' }, { text: '💸 Cara Tarik' }],
    [{ text: '❓ Bantuan' }, { text: '👤 Hubungi Admin' }]
  ],
  resize_keyboard: true,
  one_time_keyboard: false
};

async function sendMessage(chatId, text, extra = {}) {
  try {
    await axios.post(`${API}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      ...extra
    });
  } catch (err) {
    console.error('Gagal kirim pesan:', err.response?.data || err.message);
  }
}

async function handleUpdate(update) {
  const message = update.message;
  if (!message || !message.text) return;

  const chatId = message.chat.id;
  const text = message.text.trim();
  const name = message.from.first_name || 'User';

  if (text === '/start') {
    await sendMessage(chatId,
      `👋 Halo *${name}*!\n\n` +
      `Selamat datang di *Bot Kuis Berhadiah* 🎉\n\n` +
      `🎯 *Cara Main:*\n` +
      `1. Klik *🎯 Main Kuis* untuk buka web\n` +
      `2. Jawab 30 soal pilihan ganda\n` +
      `3. Tiap jawaban benar dapat *Rp50*\n` +
      `4. Kumpulin minimal *Rp1.000*\n` +
      `5. Tarik saldo ke DANA/OVO/GoPay/ShopeePay\n\n` +
      `📌 *Command tersedia:*\n` +
      `/start - Mulai bot & lihat menu\n` +
      `/menu - Menu utama\n` +
      `/saldo - Cek saldo\n` +
      `/riwayat - Riwayat penarikan\n` +
      `/bantuan - Bantuan\n` +
      `/admin - Hubungi admin\n\n` +
      `Pilih menu di bawah untuk mulai 👇`,
      { reply_markup: mainKeyboard }
    );
    return;
  }

  if (text === '/menu' || text === '📋 Menu') {
    await sendMessage(chatId,
      `📋 *Menu Utama*\n\nSilakan pilih menu di bawah:`,
      { reply_markup: mainKeyboard }
    );
    return;
  }

  if (text === '🎯 Main Kuis' || text === '/main') {
    await sendMessage(chatId,
      `🎯 *Main Kuis*\n\nKlik link di bawah untuk buka web kuis:\n👉 ${WEB_URL}\n\nJawab soal, kumpulin saldo, terus tarik ke e-wallet kamu!`,
      { reply_markup: mainKeyboard }
    );
    return;
  }

  if (text === '/saldo' || text === '💰 Cek Saldo') {
    await sendMessage(chatId,
      `💰 *Cek Saldo*\n\nBuka web kuis untuk lihat saldo: ${WEB_URL}`,
      { reply_markup: mainKeyboard }
    );
    return;
  }

  if (text === '/riwayat' || text === '📜 Riwayat') {
    await sendMessage(chatId,
      `📜 *Riwayat Penarikan*\n\nBuka web kuis, klik tombol *📜 Riwayat* di wallet.`,
      { reply_markup: mainKeyboard }
    );
    return;
  }

  if (text === '💸 Cara Tarik' || text === '/tarik') {
    await sendMessage(chatId,
      `💸 *Cara Tarik Saldo*\n\n1. Kumpulin saldo minimal Rp1.000\n2. Klik *💸 Tarik Saldo* di web\n3. Pilih metode DANA/OVO/GoPay/ShopeePay\n4. Isi nomor & nama\n5. Kirim\n6. Proses maks 1×24 jam`,
      { reply_markup: mainKeyboard }
    );
    return;
  }

  if (text === '/bantuan' || text === '❓ Bantuan') {
    await sendMessage(chatId,
      `❓ *Bantuan*\n\nMinimal penarikan Rp1.000. Proses 1×24 jam. Metode: DANA, OVO, GoPay, ShopeePay.`,
      { reply_markup: mainKeyboard }
    );
    return;
  }

  if (text === '/admin' || text === '👤 Hubungi Admin') {
    await sendMessage(chatId,
      `👤 *Hubungi Admin*\n\nChat admin: @budi2012`,
      { reply_markup: mainKeyboard }
    );
    return;
  }

  await sendMessage(chatId,
    `🤔 Perintah *${text}* tidak dikenal.\n\nKetik /menu untuk lihat menu utama.`,
    { reply_markup: mainKeyboard }
  );
}

let offset = 0;

async function poll() {
  try {
    const res = await axios.get(`${API}/getUpdates`, {
      params: { offset, timeout: 30 }
    });

    for (const update of res.data.result) {
      offset = update.update_id + 1;
      await handleUpdate(update);
    }
  } catch (err) {
    console.error('Polling error:', err.message);
  }

  setTimeout(poll, 1000);
}

console.log('🤖 Bot polling aktif...');
poll();
