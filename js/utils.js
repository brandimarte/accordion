import { bassNotes, indexToAllNotes } from './config.js';

export function findClosestNoteToLeft(rootNote, rootNoteIndex, targetNoteChromaticIndex) {
  const enharmonicTargetNotes = indexToAllNotes[targetNoteChromaticIndex] || [];
  const rootNoteBassIndex = bassNotes.indexOf(rootNote);

  let bestFitNote = null;
  let minDistance = Infinity;

  for (const note of enharmonicTargetNotes) {
    const noteBassIndex = bassNotes.indexOf(note);
    if (noteBassIndex !== -1 && noteBassIndex < rootNoteBassIndex) {
      const distance = rootNoteBassIndex - noteBassIndex;
      if (distance < minDistance) {
        minDistance = distance;
        bestFitNote = note;
      }
    }
  }
  return bestFitNote;
}
