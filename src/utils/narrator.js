/**
 * Speech narration that survives a long documentary.
 *
 * The browser SpeechSynthesis API has two failure modes this works around:
 *
 * 1. Chrome stops speaking after roughly fifteen seconds of one continuous
 *    utterance. Splitting the text into sentence-sized utterances keeps every
 *    one of them well under that ceiling.
 * 2. Chrome's synthesiser degrades after repeated `cancel()` calls made while
 *    it is mid-sentence, and eventually accepts utterances without ever
 *    producing audio. Cancelling only when something is actually speaking, and
 *    pumping pause/resume on a timer, keeps the engine alive.
 */

const RATE = 1.02;
const PITCH = 1.12;

/**
 * Voices ranked for a young, clear, documentary-style male narrator. Names are
 * matched loosely because the same voice ships under different labels across
 * platforms. Anything obviously deep or elderly is pushed down the list.
 */
const PREFERRED = [
  /guy(neural)?/i, // Microsoft Guy - bright young US male
  /ryan(neural)?/i, // Microsoft Ryan - young UK male
  /brian(neural)?/i,
  /christopher/i,
  /google uk english male/i,
  /google us english/i,
  /alex/i,
];

const AVOID = /daniel|george|arthur|fred|grandpa|rishi|deep|bass/i;

function scoreVoice(voice) {
  if (!/^en/i.test(voice.lang)) return -1;

  let score = 0;
  const index = PREFERRED.findIndex((pattern) => pattern.test(voice.name));
  if (index >= 0) score += 100 - index * 10;
  if (/neural|natural/i.test(voice.name)) score += 25;
  if (/female|zira|aria|jenny|samantha|karen/i.test(voice.name)) score -= 60;
  if (AVOID.test(voice.name)) score -= 40;
  if (/en[-_]GB|en[-_]US/i.test(voice.lang)) score += 10;

  return score;
}

export function createNarrator() {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  let enabled = true;
  let voice = null;
  let rate = RATE;
  let keepAlive = 0;

  if (synth) {
    const pickVoice = () => {
      const voices = synth.getVoices();
      if (!voices.length) return;
      voice = voices
        .map((candidate) => ({ candidate, score: scoreVoice(candidate) }))
        .filter(({ score }) => score >= 0)
        .sort((a, b) => b.score - a.score)[0]?.candidate;
    };

    pickVoice();
    // Voices load asynchronously in Chrome; without this the opening line can
    // be spoken with the wrong voice, or dropped entirely.
    synth.addEventListener("voiceschanged", pickVoice);

    // The engine goes quiet on long runs unless it is nudged.
    keepAlive = window.setInterval(() => {
      if (synth.speaking && !synth.paused) {
        synth.pause();
        synth.resume();
      }
    }, 8000);
  }

  const stop = () => {
    if (!synth) return;
    // Cancelling an idle synthesiser is what wedges Chrome. Only cancel when
    // there is genuinely something to interrupt.
    if (synth.speaking || synth.pending) synth.cancel();
  };

  const speak = (text) => {
    if (!synth) return;
    stop();
    if (!enabled || !text) return;

    // Sentence-sized utterances: short enough to dodge the fifteen second
    // cutoff, and they queue natively so the delivery stays continuous.
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];

    sentences
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .forEach((sentence) => {
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.rate = rate;
        utterance.pitch = PITCH;
        if (voice) utterance.voice = voice;
        synth.speak(utterance);
      });
  };

  return {
    speak,
    stop,
    pause: () => synth?.speaking && synth.pause(),
    resume: () => synth?.paused && synth.resume(),
    /** Playback speed as a multiplier of the documentary rate. */
    setRate(multiplier) {
      rate = RATE * multiplier;
    },
    setEnabled(next) {
      enabled = next;
      if (!next) stop();
    },
    destroy() {
      stop();
      if (keepAlive) window.clearInterval(keepAlive);
    },
  };
}
