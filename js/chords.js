import { noteToIndex, flatNoteMap, sharpNoteMap, bassNotes, indexToAllNotes } from './config.js';
import { buttons } from './drawing.js';
import { findClosestNoteToLeft } from './utils.js';

function activate(targetNote, rowType, className = "active") {
  buttons
    .filter(b => b.dataset.note === targetNote && b.dataset.rowType === rowType)
    .forEach(b => {
      b.classList.add(className);
    });
}

const chordHighlighters = {
  "major": (rootNote, className) => {
    activate(rootNote, "bass", className);
    activate(rootNote, "major", className);
  },
  "minor": (rootNote, className) => {
    activate(rootNote, "bass", className);
    activate(rootNote, "minor", className);
  },
  "seventh": (rootNote, className) => {
    activate(rootNote, "bass", className);
    activate(rootNote, "seventh", className);
  },
  "diminished": (rootNote, className) => {
    activate(rootNote, "bass", className);
    activate(rootNote, "diminished", className);
  },
  "dim_triad": (rootNote, className, { rootNoteIndex }) => {
    const unplayable_dim_roots = ["Cb", "Fb", "Bbb"];
    if (unplayable_dim_roots.includes(rootNote)) {
      return;
    }

    const minorThirdIndex = (rootNoteIndex + 3) % 12;
    const bestFitMinorThird = findClosestNoteToLeft(rootNote, rootNoteIndex, minorThirdIndex);

    if (bestFitMinorThird) {
      activate(rootNote, "bass", className);
      activate(bestFitMinorThird, "diminished", className);
    }
  },
  "maj7": (rootNote, className, { rootNoteIndex, primaryMap }) => {
    const unplayable_maj7_roots = ["C#", "G#", "D#", "A#"];
    if (unplayable_maj7_roots.includes(rootNote)) {
      return;
    }
    const majorThirdIndex = (rootNoteIndex + 4) % 12;
    const majorThirdNote = primaryMap[majorThirdIndex];
    activate(rootNote, "bass", className);
    activate(majorThirdNote, "minor", className);
  },
  "m7": (rootNote, className, { rootNoteIndex }) => {
    const unplayable_m7_roots = ["Cb", "Fb", "Bbb"];
    if (unplayable_m7_roots.includes(rootNote)) {
      return;
    }

    const minorThirdIndex = (rootNoteIndex + 3) % 12;
    const bestFitMinorThird = findClosestNoteToLeft(rootNote, rootNoteIndex, minorThirdIndex);

    if (bestFitMinorThird) {
      activate(rootNote, "bass", className);
      activate(bestFitMinorThird, "major", className);
    }
  },
  "6": (rootNote, className, { rootNoteIndex, primaryMap }) => {
    const unplayable_6_roots = ["G#", "D#", "A#"];
    if (unplayable_6_roots.includes(rootNote)) {
      return;
    }
    const sixthIndex = (rootNoteIndex + 9) % 12;
    const sixthNote = primaryMap[sixthIndex];
    activate(rootNote, "bass", className);
    activate(sixthNote, "minor", className);
  },
  "m6": (rootNote, className) => {
    activate(rootNote, "bass", className);
    activate(rootNote, "minor", className);
    activate(rootNote, "diminished", className);
  },
  "7b5": (rootNote, className, { rootNoteIndex }) => {
    const unplayable_m7b5_roots = ["Cb", "Fb", "Bbb"];
    if (unplayable_m7b5_roots.includes(rootNote)) {
      return;
    }

    const minorThirdIndex = (rootNoteIndex + 3) % 12;
    const bestFitMinorThird = findClosestNoteToLeft(rootNote, rootNoteIndex, minorThirdIndex);

    if (bestFitMinorThird) {
      activate(rootNote, "bass", className);
      activate(bestFitMinorThird, "minor", className);
    }
  },
  "7(9)": (rootNote, className, { rootNoteIndex }) => {
    const rootNoteBassIndex = bassNotes.indexOf(rootNote);
    const expectedFifthNote = bassNotes[rootNoteBassIndex + 1];

    if (expectedFifthNote) {
      const expectedFifthChromaticIndex = noteToIndex[expectedFifthNote];
      const correctFifthChromaticIndex = (rootNoteIndex + 7) % 12;

      if (expectedFifthChromaticIndex === correctFifthChromaticIndex) {
        activate(rootNote, "bass", className);
        activate(rootNote, "seventh", className);
        activate(expectedFifthNote, "minor", className);
      }
    }
  }
};

export function highlightSingleChord(rootNote, chordType, className) {
  const highlighter = chordHighlighters[chordType];
  if (highlighter) {
    const rootNoteIndex = noteToIndex[rootNote];
    if (rootNoteIndex === undefined) return;

    const isFlatKey = rootNote.includes('b') || rootNote === 'F';
    const primaryMap = isFlatKey ? flatNoteMap : sharpNoteMap;
    
    const context = { rootNoteIndex, primaryMap };
    highlighter(rootNote, className, context);
  }
}
