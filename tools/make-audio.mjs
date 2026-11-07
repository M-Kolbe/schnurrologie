/* Records the narration of all Erklär-Filme as MP3 files with a natural AI voice (OpenAI TTS).
   Usage (from the repo root):  OPENAI_API_KEY=... node tools/make-audio.mjs
   Writes audio/<chapter>-<scene>.mp3 and audio/index.json. The app uses them automatically. */
import fs from 'fs';
import { CHAPTERS } from '../js/content.js';

const KEY = process.env.OPENAI_API_KEY || 'set-by-proxy';
const VOICE = process.env.TTS_VOICE || 'nova';
const MODEL = process.env.TTS_MODEL || 'gpt-4o-mini-tts';
const INSTRUCTIONS = 'Sprich Deutsch (österreichisch gefärbt ist willkommen), freundlich und warm, wie eine junge Tierärztin, die einer 15-Jährigen etwas Spannendes erklärt. Ruhiges, natürliches Tempo, klare Betonung der Fachwörter, kleine Pausen zwischen den Sätzen.';
const OUT = new URL('../audio/', import.meta.url);
fs.mkdirSync(OUT, { recursive: true });

const index = { voice: `${MODEL} · ${VOICE}`, chapters: {} };
for (const ch of CHAPTERS) {
  for (let i = 0; i < ch.video.length; i++) {
    const file = new URL(`${ch.id}-${i}.mp3`, OUT);
    if (fs.existsSync(file) && !process.env.FORCE) continue;
    const text = ch.video[i].say.replace(/Doktor/g, 'Doktor');
    const r = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, voice: VOICE, input: text, instructions: INSTRUCTIONS, response_format: 'mp3' }),
    });
    if (!r.ok) { console.error('Fehler', ch.id, i, r.status, await r.text()); process.exit(1); }
    fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    console.log('ok', ch.id, i);
  }
  index.chapters[ch.id] = ch.video.length;
}
fs.writeFileSync(new URL('index.json', OUT), JSON.stringify(index, null, 2));
console.log('fertig:', Object.values(index.chapters).reduce((a, b) => a + b, 0), 'Szenen');
