import { noteToIndex } from './config.js';

const standardNoteMap = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

function toStandardNote(note) {
  const index = noteToIndex[note];
  return index !== undefined ? standardNoteMap[index] : note;
}

let instrument;
let audioContext;

export async function initAudio() {
  audioContext = new AudioContext();
  instrument = await Soundfont.instrument(audioContext, 'accordion');
}

export function playNote(note, octave = 3) {
  if (!instrument) return;
  instrument.play(`${toStandardNote(note)}${octave}`, audioContext.currentTime, { duration: 1.0 });
}

export function playChord(notes, octave = 4) {
  if (!instrument || !notes || notes.length === 0) return;
  instrument.stop();
  notes.forEach(note => {
    instrument.play(`${toStandardNote(note)}${octave}`, audioContext.currentTime, { duration: 1.5 });
  });
}

export function playChordWithBass(bassNote, chordNotes, chordOctave = 4, bassOctave = 3) {
  if (!instrument || !bassNote || !chordNotes) return;
  instrument.stop();
  instrument.play(`${toStandardNote(bassNote)}${bassOctave}`, audioContext.currentTime, { duration: 2.0, gain: 1.5 });
  chordNotes.forEach(note => {
    instrument.play(`${toStandardNote(note)}${chordOctave}`, audioContext.currentTime, { duration: 2.0 });
  });
}
