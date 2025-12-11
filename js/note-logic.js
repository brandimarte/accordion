import { noteToIndex, flatNoteMap, sharpNoteMap } from './config.js';

// --- Chord note calculation ---
export function getChordNotes(rootNote, chordType) {
  const rootIndex = noteToIndex[rootNote];
  if (rootIndex === undefined) return [];

  const isFlatKey = rootNote.includes('b') || rootNote === 'F';
  const primaryMap = isFlatKey ? flatNoteMap : sharpNoteMap;

  const notes = [];
  let third, fifth, seventh, ninth, sixth;

  // The root note spelling should be preserved from the bassNotes array
  notes.push(rootNote);

  switch (chordType) {
    case "major": // R, M3, P5
      third = primaryMap[(rootIndex + 4) % 12];
      fifth = primaryMap[(rootIndex + 7) % 12];
      notes.push(third, fifth);
      break;
    case "minor": // R, m3, P5
      third = flatNoteMap[(rootIndex + 3) % 12]; // Minor third is typically a flat
      fifth = primaryMap[(rootIndex + 7) % 12];
      notes.push(third, fifth);
      break;
    case "seventh": // R, M3, m7
      third = primaryMap[(rootIndex + 4) % 12];
      seventh = flatNoteMap[(rootIndex + 10) % 12]; // Dominant seventh is a flat
      notes.push(third, seventh);
      break;
    case "diminished": // As per user: Root, m3, d7
      third = flatNoteMap[(rootIndex + 3) % 12]; // Minor third is a flat
      seventh = flatNoteMap[(rootIndex + 9) % 12]; // Diminished seventh is a flat
      notes.push(third, seventh);
      break;
    case "dim_triad": // R, m3, d5
      third = flatNoteMap[(rootIndex + 3) % 12]; // Minor third
      fifth = flatNoteMap[(rootIndex + 6) % 12]; // Diminished fifth
      notes.push(third, fifth);
      break;
    case "6": // R, M3, P5, M6
      third = primaryMap[(rootIndex + 4) % 12]; // Major third
      fifth = primaryMap[(rootIndex + 7) % 12]; // Perfect fifth
      sixth = primaryMap[(rootIndex + 9) % 12]; // Major sixth
      notes.push(third, fifth, sixth);
      break;
    case "m6": // R, m3, P5, M6
      third = flatNoteMap[(rootIndex + 3) % 12]; // Minor third
      fifth = primaryMap[(rootIndex + 7) % 12]; // Perfect fifth
      sixth = primaryMap[(rootIndex + 9) % 12]; // Major sixth
      notes.push(third, fifth, sixth);
      break;
    case "m7": // R, m3, P5, m7
      third = flatNoteMap[(rootIndex + 3) % 12]; // Minor third
      fifth = primaryMap[(rootIndex + 7) % 12]; // Perfect fifth
      seventh = flatNoteMap[(rootIndex + 10) % 12]; // Minor seventh
      notes.push(third, fifth, seventh);
      break;
    case "7b5": // R, m3, d5, m7
      third = flatNoteMap[(rootIndex + 3) % 12]; // Minor third
      fifth = flatNoteMap[(rootIndex + 6) % 12]; // Diminished fifth
      seventh = flatNoteMap[(rootIndex + 10) % 12]; // Minor seventh
      notes.push(third, fifth, seventh);
      break;
    case "maj7": // R, M3, P5, M7
      third = primaryMap[(rootIndex + 4) % 12];
      fifth = primaryMap[(rootIndex + 7) % 12];
      seventh = primaryMap[(rootIndex + 11) % 12]; // Major seventh
      notes.push(third, fifth, seventh);
      break;
    case "7(9)_var":
    case "7(9)": // R, M3, P5, m7, M9
      third = primaryMap[(rootIndex + 4) % 12]; // Major third
      fifth = primaryMap[(rootIndex + 7) % 12]; // Perfect fifth
      seventh = flatNoteMap[(rootIndex + 10) % 12]; // Minor seventh
      ninth = primaryMap[(rootIndex + 2) % 12]; // Major ninth
      notes.push(third, fifth, seventh, ninth);
      break;
    case "m9": // R, m3, P5, m7, M9
      third = flatNoteMap[(rootIndex + 3) % 12]; // Minor third
      fifth = primaryMap[(rootIndex + 7) % 12]; // Perfect fifth
      seventh = flatNoteMap[(rootIndex + 10) % 12]; // Minor seventh
      ninth = primaryMap[(rootIndex + 2) % 12]; // Major ninth
      notes.push(third, fifth, seventh, ninth);
      break;
    default:
      return [];
  }
  return notes;
}
