import { noteToIndex, flatNoteMap, sharpNoteMap, bassNotes, indexToAllNotes } from './config.js';
import { buttons } from './drawing.js';
import { findClosestNoteToLeft, findClosestNoteToRight } from './utils.js';

// --- Playability Rules ---
const unplayableRootsMap = {
  "6": ["G#", "D#", "A#"],
  "maj7": ["C#", "G#", "D#", "A#"],
  "dim_triad": ["Cb", "Fb", "Bbb"],
  "m7": ["Cb", "Fb", "Bbb"],
  "7b5": ["Cb", "Fb", "Bbb"],
  "7b5_var": ["Cb", "Fb", "Bbb"],
  "7b6": ["Bbb"],
  "7(9)" : ["A#"],
  "7(9)_var" : ["A#"],
  "7(b9)": ["Bbb", "Fb"],
  "m9" : ["A#"],
  "7sus4": ["Bbb", "Fb", "A#"],
  "9sus4" : ["A#", "Fb", "Bbb"],
  "maj9": ["C#", "G#", "D#", "A#"],
  "aug": ["C#", "G#", "D#", "A#"],
};

function isPlayable(rootNote, chordType) {
  const unplayableNotes = unplayableRootsMap[chordType];
  if (unplayableNotes && unplayableNotes.includes(rootNote)) {
    return false;
  }
  return true;
}

// --- Activation Helpers ---

function getButtonCoords(button) {
  return {
    x: parseFloat(button.getAttribute('cx')),
    y: parseFloat(button.getAttribute('cy'))
  };
}

// Helper to find and activate the best bass/counter-bass button for a given note
function activateBassNote(targetNote, rootNote, className = "active") {
  const targetNoteIndex = noteToIndex[targetNote];
  if (targetNoteIndex === undefined) return;

  // 1. Find the root note's bass button and its coordinates.
  const rootNoteBassButton = buttons.find(b => b.dataset.note === rootNote && b.dataset.rowType === "bass");
  if (!rootNoteBassButton) return; // Should not happen
  const rootNoteCoords = getButtonCoords(rootNoteBassButton);

  // 2. Find all candidate buttons for the target bass note.
  const candidateButtons = buttons.filter(b => {
    const rowType = b.dataset.rowType;
    if (rowType !== "bass" && rowType !== "counterbass") {
      return false;
    }

    let buttonNote;
    if (rowType === "bass") {
      buttonNote = b.dataset.note;
    } else { // counterbass
      const fundamentalNote = b.dataset.note;
      const fundamentalNoteIndex = noteToIndex[fundamentalNote];
      if (fundamentalNoteIndex === undefined) return false;

      const counterBassIndex = (fundamentalNoteIndex + 4) % 12;
      const isFlatKey = fundamentalNote.includes('b') || fundamentalNote === 'F';
      const primaryMap = isFlatKey ? flatNoteMap : sharpNoteMap;
      buttonNote = primaryMap[counterBassIndex];
    }

    const targetNoteIndex = noteToIndex[targetNote];
    const buttonNoteIndex = noteToIndex[buttonNote];

    return targetNoteIndex === buttonNoteIndex;
  });

  if (candidateButtons.length === 0) return;

  // 3. Calculate distances and find the closest button.
  let closestButton = null;
  let minDistance = Infinity;

  for (const button of candidateButtons) {
    const buttonCoords = getButtonCoords(button);
    const distance = Math.sqrt(Math.pow(rootNoteCoords.x - buttonCoords.x, 2) + Math.pow(rootNoteCoords.y - buttonCoords.y, 2));

    if (distance < minDistance) {
      minDistance = distance;
      closestButton = button;
    }
  }

  // 4. Activate the closest button.
  if (closestButton) {
    closestButton.classList.add(className);
  }
}

// Activates the counter-bass button whose computed note matches rootNote (for m7b5 var)
function activateRootCounterBass(rootNote, className = "active") {
  const rootNoteIndex = noteToIndex[rootNote];
  if (rootNoteIndex === undefined) return;

  const rootNoteBassButton = buttons.find(b => b.dataset.note === rootNote && b.dataset.rowType === "bass");
  if (!rootNoteBassButton) return;
  const rootNoteCoords = getButtonCoords(rootNoteBassButton);

  const candidateButtons = buttons.filter(b => {
    if (b.dataset.rowType !== "counterbass") return false;
    const fundamentalNote = b.dataset.note;
    const fundamentalNoteIndex = noteToIndex[fundamentalNote];
    if (fundamentalNoteIndex === undefined) return false;
    const counterBassIndex = (fundamentalNoteIndex + 4) % 12;
    const isFlatKey = fundamentalNote.includes('b') || fundamentalNote === 'F';
    const primaryMap = isFlatKey ? flatNoteMap : sharpNoteMap;
    const buttonNote = primaryMap[counterBassIndex];
    return noteToIndex[buttonNote] === rootNoteIndex;
  });

  if (candidateButtons.length === 0) return false;

  let closestButton = null;
  let minDistance = Infinity;
  for (const button of candidateButtons) {
    const buttonCoords = getButtonCoords(button);
    const distance = Math.sqrt(Math.pow(rootNoteCoords.x - buttonCoords.x, 2) + Math.pow(rootNoteCoords.y - buttonCoords.y, 2));
    if (distance < minDistance) {
      minDistance = distance;
      closestButton = button;
    }
  }

  if (closestButton) {
    if (closestButton.classList.contains("active")) {
      return true; // same physical position as primary; caller should skip chord highlighting
    }
    closestButton.classList.add(className);
  }
  return false;
}

// Activates all non-primary counter-bass buttons for rootNote as "alternative"
function activateCounterBassAlternatives(rootNote) {
  const rootNoteIndex = noteToIndex[rootNote];
  if (rootNoteIndex === undefined) return;

  const rootNoteBassButton = buttons.find(b => b.dataset.note === rootNote && b.dataset.rowType === "bass");
  if (!rootNoteBassButton) return;
  const rootNoteCoords = getButtonCoords(rootNoteBassButton);

  const candidateButtons = buttons.filter(b => {
    if (b.dataset.rowType !== "counterbass") return false;
    const fundamentalNote = b.dataset.note;
    const fundamentalNoteIndex = noteToIndex[fundamentalNote];
    if (fundamentalNoteIndex === undefined) return false;
    const counterBassIndex = (fundamentalNoteIndex + 4) % 12;
    const isFlatKey = fundamentalNote.includes('b') || fundamentalNote === 'F';
    const primaryMap = isFlatKey ? flatNoteMap : sharpNoteMap;
    const buttonNote = primaryMap[counterBassIndex];
    return noteToIndex[buttonNote] === rootNoteIndex;
  });

  let primary = null;
  let minDistance = Infinity;
  for (const button of candidateButtons) {
    const buttonCoords = getButtonCoords(button);
    const distance = Math.sqrt(Math.pow(rootNoteCoords.x - buttonCoords.x, 2) + Math.pow(rootNoteCoords.y - buttonCoords.y, 2));
    if (distance < minDistance) {
      minDistance = distance;
      primary = button;
    }
  }

  for (const button of candidateButtons) {
    if (button !== primary && !button.classList.contains("active")) {
      button.classList.add("alternative");
    }
  }
}

function activate(targetNote, rowType, className = "active") {
  buttons
    .filter(b => b.dataset.note === targetNote && b.dataset.rowType === rowType)
    .forEach(b => {
      b.classList.add(className);
    });
}

// --- Chord Highlighters (Chord part only) ---

const chordHighlighters = {
  "major": (rootNote, className) => {
    activate(rootNote, "major", className);
  },
  "minor": (rootNote, className) => {
    activate(rootNote, "minor", className);
  },
  "seventh": (rootNote, className) => {
    activate(rootNote, "seventh", className);
  },
  "diminished": (rootNote, className) => {
    activate(rootNote, "diminished", className);
  },
  "dim_triad": (rootNote, className, { rootNoteIndex }) => {
    const bestFitMinorThird = findClosestNoteToLeft(rootNote, rootNoteIndex, (rootNoteIndex + 3) % 12);
    if (bestFitMinorThird) {
      activate(bestFitMinorThird, "diminished", className);
    }
  },
  "maj7": (rootNote, className, { rootNoteIndex, primaryMap }) => {
    const majorThirdNote = primaryMap[(rootNoteIndex + 4) % 12];
    activate(majorThirdNote, "minor", className);
  },
  "m7": (rootNote, className, { rootNoteIndex }) => {
    const bestFitMinorThird = findClosestNoteToLeft(rootNote, rootNoteIndex, (rootNoteIndex + 3) % 12);
    if (bestFitMinorThird) {
      activate(bestFitMinorThird, "major", className);
    }
  },
  "6": (rootNote, className, { rootNoteIndex, primaryMap }) => {
    const sixthNote = primaryMap[(rootNoteIndex + 9) % 12];
    activate(rootNote, "major", className);
    activate(sixthNote, "minor", className);
  },
  "m6": (rootNote, className) => {
    activate(rootNote, "minor", className);
    activate(rootNote, "diminished", className);
  },
  "7b5": (rootNote, className, { rootNoteIndex }) => {
    const bestFitMinorThird = findClosestNoteToLeft(rootNote, rootNoteIndex, (rootNoteIndex + 3) % 12);
    if (bestFitMinorThird) {
      activate(bestFitMinorThird, "minor", className);
    }
  },
  "7b5_var": (rootNote, className, { rootNoteIndex }) => {
    const minorThirdIndex = (rootNoteIndex + 3) % 12;
    const bestFitLeft = findClosestNoteToLeft(rootNote, rootNoteIndex, minorThirdIndex);
    const bestFitRight = findClosestNoteToRight(rootNote, rootNoteIndex, minorThirdIndex);
    if (bestFitLeft) {
      activate(bestFitLeft, "minor", className);
    }
    if (bestFitRight && bestFitRight !== bestFitLeft) {
      buttons
        .filter(b => b.dataset.note === bestFitRight && b.dataset.rowType === "minor" && !b.classList.contains("active"))
        .forEach(b => b.classList.add("alternative"));
      activateCounterBassAlternatives(rootNote);
    }
  },
  "7b6": (rootNote, className, { rootNoteIndex }) => {
    const fourthIndex = (rootNoteIndex + 5) % 12;
    const bestFitFourth = findClosestNoteToLeft(rootNote, rootNoteIndex, fourthIndex);
    if (bestFitFourth) {
      activate(rootNote, "seventh", className);
      activate(bestFitFourth, "minor", className);
    }
  },
  "7(9)": (rootNote, className, { rootNoteIndex }) => {
    const rootNoteBassIndex = bassNotes.indexOf(rootNote);
    const expectedFifthNote = bassNotes[rootNoteBassIndex + 1];
    if (expectedFifthNote) {
      const expectedFifthChromaticIndex = noteToIndex[expectedFifthNote];
      const correctFifthChromaticIndex = (rootNoteIndex + 7) % 12;
      if (expectedFifthChromaticIndex === correctFifthChromaticIndex) {
        activate(rootNote, "seventh", className);
        activate(expectedFifthNote, "minor", className);
      }
    }
  },
  "7(b9)": (rootNote, className, { rootNoteIndex }) => {
    const rootNoteBassIndex = bassNotes.indexOf(rootNote);
    const minorSeventhNote = bassNotes[rootNoteBassIndex - 2];
    if (minorSeventhNote) {
      const minorSeventhChromaticIndex = noteToIndex[minorSeventhNote];
      const correctMinorSeventhChromaticIndex = (rootNoteIndex + 10) % 12;
      if (minorSeventhChromaticIndex === correctMinorSeventhChromaticIndex) {
        activate(rootNote, "major", className);
        activate(minorSeventhNote, "diminished", className);
      }
    }
  },
  "7(9)_var": (rootNote, className, { rootNoteIndex }) => {
    const rootNoteBassIndex = bassNotes.indexOf(rootNote);
    const expectedFifthNote = bassNotes[rootNoteBassIndex + 1];
    if (expectedFifthNote) {
      const expectedFifthChromaticIndex = noteToIndex[expectedFifthNote];
      const correctFifthChromaticIndex = (rootNoteIndex + 7) % 12;
      if (expectedFifthChromaticIndex === correctFifthChromaticIndex) {
        activate(rootNote, "major", className);
        activate(expectedFifthNote, "minor", className);
      }
    }
  },
  "m9": (rootNote, className, { rootNoteIndex }) => {
    const rootNoteBassIndex = bassNotes.indexOf(rootNote);
    const expectedFifthNote = bassNotes[rootNoteBassIndex + 1];
    if (expectedFifthNote) {
      const expectedFifthChromaticIndex = noteToIndex[expectedFifthNote];
      const correctFifthChromaticIndex = (rootNoteIndex + 7) % 12;
      if (expectedFifthChromaticIndex === correctFifthChromaticIndex) {
        activate(rootNote, "minor", className);
        activate(expectedFifthNote, "minor", className);
      }
    }
  },
  "7sus4": (rootNote, className, { rootNoteIndex, primaryMap }) => {
    const fourthNote = primaryMap[(rootNoteIndex + 5) % 12];
    const fifthNote = primaryMap[(rootNoteIndex + 7) % 12];
    const minorSeventhNote = primaryMap[(rootNoteIndex + 10) % 12];
    activateBassNote(fourthNote, rootNote, className);
    activateBassNote(fifthNote, rootNote, className);
    activateBassNote(minorSeventhNote, rootNote, className);
  },
  "9sus4": (rootNote, className, { rootNoteIndex, primaryMap }) => {
    const fifthNote = primaryMap[(rootNoteIndex + 7) % 12];

    const minorSeventhIndex = (rootNoteIndex + 10) % 12;
    const bestFitMinorSeventh = findClosestNoteToLeft(rootNote, rootNoteIndex, minorSeventhIndex);

    if (bestFitMinorSeventh) {
      activate(fifthNote, "minor", className);
      activate(bestFitMinorSeventh, "major", className);
    }
  },
  "maj9": (rootNote, className, { rootNoteIndex }) => {
    const majorThirdIndex = (rootNoteIndex + 4) % 12;
    const bestFitMajorThird = findClosestNoteToRight(rootNote, rootNoteIndex, majorThirdIndex);

    const fifthIndex = (rootNoteIndex + 7) % 12;
    const bestFitFifth = findClosestNoteToRight(rootNote, rootNoteIndex, fifthIndex);

    if (bestFitMajorThird && bestFitFifth) {
      activate(bestFitMajorThird, "minor", className);
      activate(bestFitFifth, "major", className);
    }
  },
  "aug": (rootNote, className, { rootNoteIndex }) => {
    const majorThirdIndex = (rootNoteIndex + 4) % 12;
    const bestFitMajorThird = findClosestNoteToRight(rootNote, rootNoteIndex, majorThirdIndex);
    if (bestFitMajorThird) {
      activate(bestFitMajorThird, "major", className);
    }
  }
};

// Chord types that use the counter-bass row (1st line) for the root instead of the bass row
const counterBassChordTypes = new Set(["7b5_var"]);

// --- Main Highlighting Function ---

export function highlightSingleChord(rootNote, chordType, className, bassNoteToHighlight) {
  // 1. Check for playability first.
  if (!isPlayable(rootNote, chordType)) {
    return;
  }

  // 2. Activate the correct bass note.
  if (bassNoteToHighlight !== rootNote) {
    // Slash chord behavior: find the best bass/counter-bass button.
    activateBassNote(bassNoteToHighlight, rootNote, className);
  } else if (counterBassChordTypes.has(chordType)) {
    // Counter-bass variation: use the counter-bass row (1st line) for the root.
    // If the counter-bass position is already "active" (same physical position as the
    // primary root), skip chord highlighting entirely to avoid spurious alternatives.
    if (activateRootCounterBass(rootNote, className)) return;
  } else {
    // Default behavior: bass is the root. Use simple activation on the 'bass' row.
    activate(rootNote, "bass", className);
  }

  // 3. Activate the chord part by calling the specific highlighter.
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
